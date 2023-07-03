import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Notification_Form } from "../entity/Notification_Form";
import { UserRequest } from "../middleware/isAuthorized";
import { createNF, fetchNF, removeNF, updateNF, createApplication } from "../services/nf.service";
import { NF_Applications } from "../entity/NF_Applications";
import { NF_Shortlisting } from "../entity/NF_Shortlisting";
import { _jobsForEnrolledCycles, isEligible, isApplied, isOpen, createNewNF, createEligibilityData, createStagesData} from "../services/job.service"


export const fetchAllJobsForStudent = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Notification_Form | void> => {
  try {

    const jobsForEnrolledCycles = await _jobsForEnrolledCycles(req?.user?.admno);

    for (const job in jobsForEnrolledCycles) {
      jobsForEnrolledCycles[job]["is_eligible"] = await isEligible(req?.user?.admno, jobsForEnrolledCycles[job].nfId);
      jobsForEnrolledCycles[job]["is_applied"] = await isApplied(req?.user?.admno, jobsForEnrolledCycles[job].nfId);
      jobsForEnrolledCycles[job]["is_open"] = await isOpen(jobsForEnrolledCycles[job].deadline);
    }

    res.status(200).json({ success: true, jobs: jobsForEnrolledCycles });
  } catch (error) {
    return next(error);
  }
};

export const fetchJobByIdForStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Notification_Form | void> => {
  try {

    const { jobId } = req.params;

    // Job Info :

    const job_description = await AppDataSource.query(`
      SELECT nfId, type, status, companyName, categoryname, profile, placeOfPosting, modeOfInternship,
      ctc, ctcBreakup, bondDetails, hasPPO, cdcInformation, additionalDetails
      FROM studentportal.notification_form, studentportal.company, studentportal.companyCategories
      WHERE notification_form.nfId = ${jobId}
      LIMIT 1
    `);

    const additional_documents = await AppDataSource.query(`
      SELECT docType, name, mimetype, previewLink, downloadLink, updateLink
      FROM studentportal.nf_supporting_docs, studentportal.document
      WHERE nf_supporting_docs.nfId =  ${jobId}
    `)

    const hiring_wrokflow = await AppDataSource.query(`
      SELECT stages.seqNo, stageName, stageType, stageMode, isCompleted, isSelected, listtype, isFinalRound
      FROM nf_job_stages AS stages
      LEFT JOIN nf_shortlisting AS shortlist
      ON stages.seqNo = shortlist.seqNo and
      shortlist.admno = "${req['user'].admno}"
      WHERE stages.nfId = ${jobId} 
    `)

    // Student Info :

    console.log(req['user'].admno)


    const studentInfo = await AppDataSource.query(`
      SELECT placementCycleId, gender, isPWD, isEWS, category, specName, student_studies_spec.cgpaValue, activeBacklogs, totalBacklogs, degreeId, percentEquivalent
      FROM studentportal.student, studentportal.specialization, studentportal.student_studies_spec, studentportal.edu_history, studentportal.placement_cycle_enrolment
      WHERE student.admno = "${req['user'].admno}" 
      and student_studies_spec.admno = "${req['user'].admno}" 
      and specialization.specId = student_studies_spec.specId
      and edu_history.admno = "${req['user'].admno}" 
      and placement_cycle_enrolment.admno = "${req['user'].admno}"
    `)

    const jobEligibility = await AppDataSource.query(`
      SELECT specName, cgpaValue, degreeId, percentEquivalent, placementCycleId
      FROM studentportal.NF_Branch_Eligibility, studentportal.specialization, studentportal.nf_history_criteria, studentportal.notification_form
      WHERE NF_Branch_Eligibility.nfId = ${jobId} 
      and specialization.specId = NF_Branch_Eligibility.specId
      and nf_history_criteria.nfId = ${jobId} 
      and notification_form.nfId = ${jobId} 
    `)

    // Eligibility Check :

    // -> Profile Verification Eligibility
    const is_profile_verified = { is_eligible: true, message: "Profile Verified" }

    // -> PlacementCylce Eligibility 
    let placement_cycle_eligibility = { is_eligible: true, message: "Eligible for this Placement Cycle" }
    if (studentInfo[0].placementCycleId != jobEligibility[0].placementCycleId)
      placement_cycle_eligibility = { is_eligible: false, message: "Not Eligible for this Placement Cycle" };

    // -> Is Already Placed
    let is_not_palced = { is_eligible: true, message: "Eligible for this job" }
    let b = true;
    for (const stage in hiring_wrokflow)
      if (hiring_wrokflow[stage].isFinalRound && hiring_wrokflow[stage].isSelected)
        b = false;
    if (!b)
      is_not_palced = { is_eligible: false, message: "Not Eligible for this job" };

    // -> Backlog Eligibility
    let backlog_eligibility;
    if (studentInfo[0].activeBacklogs != 0)
      backlog_eligibility = {
        is_eligible: false,
        message: `ActiveBacklogs : ${studentInfo[0].activeBacklogs} , TotalBacklogs : ${studentInfo[0].totalBacklogs}`
      }
    else
      backlog_eligibility = { is_eligible: true, message: "No backlogs" };

    // -> Course Eligibility
    let course_eligibility = { is_eligible: true, message: "Criteria satisfied" }
    b = false;
    for (const i in jobEligibility)
      if (jobEligibility[i].specName == studentInfo[0].specName) { b = true; break }
    if (!b)
      course_eligibility = { is_eligible: false, message: "Criteria not satisfied" };

    // -> Acadamic Eligibility 
    let academic_eligibility = {
      is_eligible: true,
      message: `Required : ${jobEligibility[0].cgpaValue} , Actual : ${studentInfo[0].cgpaValue}`
    };
    if (jobEligibility[0].cgpaValue > studentInfo[0].cgpaValue)
      academic_eligibility = {
        is_eligible: false,
        message: `Required : ${jobEligibility[0].cgpaValue} , Actual : ${studentInfo[0].cgpaValue}`
      }

    // -> Education_History Eligibility
    const n = jobEligibility.length

    let edu_history_10_eligibility = {
      is_eligible: true,
      message: `Required : ${jobEligibility[n - 1].percentEquivalent} , Actual : ${studentInfo[1].percentEquivalent}`
    }
    if (jobEligibility[0].percentEquivalent > studentInfo[0].percentEquivalent)
      edu_history_10_eligibility = {
        is_eligible: false,
        message: `Required : ${jobEligibility[n - 1].percentEquivalent} , Actual : ${studentInfo[1].percentEquivalent}`
      };

    let edu_history_12_eligibility = {
      is_eligible: true, message:
        `Required : ${jobEligibility[n - 1].percentEquivalent} , Actual : ${studentInfo[1].percentEquivalent}`
    }
    if (jobEligibility[n - 1].percentEquivalent > studentInfo[1].percentEquivalent)
      edu_history_12_eligibility = {
        is_eligible: false, message:
          `Required : ${jobEligibility[n - 1].percentEquivalent} , Actual : ${studentInfo[1].percentEquivalent}`
      }

    res.status(201).json({
      success: true,
      job_description: job_description?.[0],
      additional_documents: additional_documents,
      hiring_wrokflow: hiring_wrokflow,
      studentInfo: studentInfo[1],
      eligibility_criteria: {
        is_profile_verified: is_profile_verified,
        placement_cycle_eligibility: placement_cycle_eligibility,
        is_not_palced: is_not_palced,
        backlog_eligibility: backlog_eligibility,
        course_eligibility: course_eligibility,
        academic_eligibility: academic_eligibility,
        edu_history_10_eligibility: edu_history_10_eligibility,
        edu_history_12_eligibility: edu_history_12_eligibility
      }
    });
  } catch (error) {
    return next(error);
  }
}

export const applyJobForStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Notification_Form | void> => {
  try {
    const { jobId } = req.params;

    if (!await isEligible(req['user'].admno, jobId) || await isApplied(req['user'].admno, jobId) || !isOpen(jobId))
      res.status(200).json({ success: false, application: "Not Applicable for Job" });
    else {
      const _application = new NF_Applications
      _application.nfId = parseInt(jobId)
      _application.admno = req['user'].admno
      _application.addedByAdmin = 0
      const job = await createApplication(_application)

      res.status(200).json({ success: true, application: job });
    }
  } catch (error) {
    return next(error);
  }
};

export const fetchJobsForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Notification_Form | void> => {
  try {
    const { placementCycleId } = req.params;

    const jobsForSelectedCycle = await AppDataSource.query(`
      SELECT nf.nfId, c.companyId as companyId, c.companyName AS companyName, nf.profile, nf.status, nf.deadline
      FROM notification_form AS nf
      LEFT JOIN company AS c
      ON c.companyId = nf.companyId
      WHERE nf.placementCycleId = ${placementCycleId} AND nf.deletedAt IS NULL
    `)

    res.status(200).json({ success: true, jobs: jobsForSelectedCycle });
  } catch (error) {
    return next(error);
  }
};

export const searchJobsForAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Notification_Form | void> => {
  try {
    const { placementCycleId, query } = req.params;

    const jobs = await AppDataSource.query(`
    SELECT nf.nfId, c.companyId as companyId, c.companyName AS companyName, nf.profile, nf.status, nf.deadline
    FROM notification_form AS nf
    LEFT JOIN company AS c
      ON c.companyId = nf.companyId
    WHERE nf.placementCycleId = ${placementCycleId} AND
    (c.companyName LIKE '%${query}%' OR
    nf.profile LIKE '%${query}%') AND nf.deletedAt IS NULL
    `);

    res.status(201).json({ success: true, jobs });
  } catch (error) {
    return next(error);
  }
}

export const createNewJob = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Notification_Form | void> => {
  try {
    const job = createNewNF(req.body);

    const newJob = await createNF(job);

    res.status(200).json({ success: true, job: newJob });
  } catch (error) {
    return next(error);
  }
};

export const updateJob = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Notification_Form | void> => {
  try {
    const {
      nfEligibility,
      nf_stages,
      // nfHistoryCriteria,
      // nf_docs,
      ...rest
    } = req.body;
    const { jobId } = req.params;
    /*
        ! Direct update would give following error "Error: Cannot query across one-to-many for property"
        *Therefore proceed by updating in parts
    */

    // update the notification_form content only
    const newJob = await updateNF(parseInt(jobId), rest);

    // update the rest sections one by one

    // updating nfEligibility section
    newJob && await AppDataSource.getRepository("NF_Branch_Eligibility").remove(
      newJob.nfEligibility
    );
    await AppDataSource.getRepository("NF_Branch_Eligibility").save(
      createEligibilityData(nfEligibility, parseInt(jobId))
    );

    // updating nf_stages section
    newJob && await AppDataSource.getRepository("NF_Job_Stages").remove(newJob.nf_stages);
    await AppDataSource.getRepository("NF_Job_Stages").save(
      createStagesData(nf_stages, parseInt(jobId))
    );
    /*
      ! Implementation for "nfHostoryCriteria" and "nf_docs" is remaining
    */
    res
      .status(200)
      .json({ success: true, job: await fetchNF(parseInt(jobId)) });
  } catch (error) {
    return next(error);
  }
};


export const deleteJob = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Notification_Form | void> => {
  try {
    const jobId = parseInt(req.params.jobId);

    await removeNF(jobId);

    res
      .status(200)
      .json({
        success: true,
        message: `Job with id = ${jobId} has been deleted successfully 👍`,
      });
  } catch (error) {
    return next(error);
  }
};

export const getApplicants = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Notification_Form | void> => {
  try {
    const { jobId } = req.params;
    console.log(jobId);

    const applicants = await AppDataSource.query(`
    SELECT nf_applications.cvId, nf_applications.admno, student.first_name, 
    student.last_name, student.phonePref, student.phone, student.dob, student.gender, 
    student.instiMailId, student.personalMailId, student.isPWD, student.category,
    student.isEWS, student.graduatingYear FROM studentportal.nf_applications, 
    studentportal.student WHERE nf_applications.nfId = ${jobId} and nf_applications.admno = student.admno; 
  `);


    res.status(200).json({ success: true, applicants })

  } catch (error) {
    return next(error)
  }
};

export const shortlistStudent = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {


    const { listType, seqNo, admno, finalCTC } = req.body
    const { jobId } = req.params
    // check applied for the company??
    const applied = await AppDataSource.query(`
     SELECT * FROM studentportal.nf_applications WHERE nf_applications.nfId = ${jobId} and nf_applications.admno = "${admno}";
  `)
    if (!applied) return res.status(400).json({ success: false, message: "Student not applied for this Job" });

    // check for alredy placed
    const placed = await AppDataSource.query(` 
  SELECT * FROM studentportal.nf_shortlisting 
  JOIN nf_job_stages ON nf_shortlisting.nfId = nf_job_stages.nfId 
  and nf_shortlisting.seqNo = nf_job_stages.seqNo 
  WHERE nf_job_stages.isFinalRound = 1 and nf_shortlisting.admno = "${admno}";
  `);
    if (placed) return res.status(400).json({ success: false, message: "Student already placed" });

    const shortlistingStudent = new NF_Shortlisting()
    shortlistingStudent.nfId = Number(jobId);
    shortlistingStudent.seqNo = Number(seqNo);
    shortlistingStudent.admno = admno;
    shortlistingStudent.listType = listType;
    shortlistingStudent.finalCTC = finalCTC
    // //  add in nf_shortlisting
    await AppDataSource.getRepository('NF_Shortlisting').save(shortlistingStudent);

    return res.status(200).json({ success: true, message: "Student added to shortlist" });
  } catch (error) {
    return next(error)
  }
}