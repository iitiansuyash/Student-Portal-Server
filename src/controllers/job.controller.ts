import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";
import { NF_Branch_Eligibility } from "../entity/NF_Branch_Eligibility";
import { NF_Job_Stages } from "../entity/NF_Job_Stages";
import { Notification_Form } from "../entity/Notification_Form";
import { NF_Supporting_Docs } from "../entity/NF_Supporting_Docs";
import { UserRequest } from "../middleware/isAuthorized";
import { NF_Repository } from "../repositories/job.repository";
import { createNF, fetchNF, removeNF, updateNF } from "../services/nf.service";
import { Notification_Form_spoc } from "../entity/Notification_Form_spoc";
import { HR_POC_NF } from "../entity/HR_POC_NF";
import { NF_Shortlisting } from "../entity/NF_Shortlisting";

const createCompanyData = (company_details) => {
  const company = new Company();

  // company.companyId = company_details.companyId;
  company.companyName = company_details.companyName;
  company.companyWebsite = company_details.companyWebsite;
  company.category = company_details.category;
  company.sector = company_details.sector;

  return company;
};

const createEligibilityData = (eligible_courses, nfId?) => {
  const eligibilityList: NF_Branch_Eligibility[] = [];

  eligible_courses?.forEach((eligible_course) => {
    const course = new NF_Branch_Eligibility();
    course.nfId = nfId;
    course.spec = eligible_course.spec;
    course.specId = eligible_course.spec.specId;
    course.minLPA = eligible_course.minLPA;
    course.maxLPA = eligible_course.maxLPA;
    course.cgpaValue = eligible_course.cgpaValue;

    eligibilityList.push(course);
  });

  return eligibilityList;
};

const createStagesData = (schedule, nfId?) => {
  const stagesList: NF_Job_Stages[] = [];

  schedule?.forEach((step, index) => {
    const newStage = new NF_Job_Stages();
    newStage.nfId = nfId;
    newStage.stage = step.stage;
    newStage.stageType = step.stageType;
    newStage.stageMode = step.stageMode;
    newStage.seqNo = index;
    newStage.isFinalRound = index === schedule.length - 1 ? 1 : 0;

    stagesList.push(newStage);
  });

  return stagesList;
};

const createDocsData = (docs, nfId?) => {
  const docsList: NF_Supporting_Docs[] = [];

  docs?.forEach(doc => {
    const newDoc = new NF_Supporting_Docs();

    newDoc.nfId = nfId;
    newDoc.docType = doc.docType;
    newDoc.document = doc.document;

    docsList.push(newDoc);
  });

  return docsList;
}

const createSpocData = (spocs, nfId?) => {
  const spocList: Notification_Form_spoc[] = [];

  spocs?.forEach(spoc => {
    const newSpoc = new Notification_Form_spoc();

    newSpoc.nfId = nfId;
    newSpoc.scpt = spoc.scpt;
    newSpoc.isPrimary = spoc.isPrimary;
    if (newSpoc.scpt)
      spocList.push(newSpoc);
  });

  return spocList;
}

const createHRData = (hrs) => {
  const hrList: HR_POC_NF[] = [];

  hrs?.forEach((hr) => {
    const newHr = new HR_POC_NF();

    newHr.hr = hr.hr;
    newHr.isPrimary = hr.isPrimary;

    hrList.push(newHr);
  })

  return hrList;
}

const createNewNF = (job) => {
  const newNF = new Notification_Form();
  const { company, nfEligibility, nf_stages, placementCycle, nf_docs, spocs, HRs } = job;

  newNF.type = job.type;
  newNF.profile = job.profile;
  newNF.placeOfPosting = job.placeOfPosting;
  newNF.jobDescription = job.jobDescription;
  newNF.modeOfInternship = job.modeOfInternship;
  newNF.ctc = job.ctc;
  newNF.ctcBreakup = job.ctcBreakup;
  newNF.bondDetails = job.bondDetails;
  newNF.hasPPO = job.hasPPO;
  newNF.ismOffersMax = job.ismOffersMax;
  newNF.ismOffersMin = job.ismOffersMin;
  newNF.cdcInformation = "Nope";
  newNF.additionalDetails = job.additionalDetails
  newNF.deadline = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days from creation
  newNF.company = createCompanyData(company);
  newNF.nfEligibility = createEligibilityData(nfEligibility);
  newNF.nf_stages = createStagesData(nf_stages);
  newNF.nfHistoryCriteria = [];
  newNF.nf_docs = createDocsData(nf_docs);
  newNF.spocs = createSpocData(spocs);
  newNF.placementCycle = placementCycle;
  newNF.HRs = createHRData(HRs);
  return newNF;
};

export const fetchAllJobsForStudent = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Notification_Form | void> => {
  try {
    const placementCycles = await AppDataSource.getRepository(
      "Placement_Cycle_Enrolment"
    )
      .createQueryBuilder("Placement_Cycle_Enrolment")
      .where(`Placement_Cycle_Enrolment.student = '${req?.user?.admno}'`)
      .execute();

    const pcis: number[] = [];
    placementCycles.forEach((element) => {
      pcis.push(element.placementCycleId);
    });

    const jobsForEnrolledCycles = await NF_Repository.createQueryBuilder(
      "Notification_Form"
    )
      .where(`Notification_Form.placementCycleId IN (:pcis)`, { pcis })
      .where(`Notification_Form.deletedAt IS NULL`)
      .getMany();

    res.status(200).json({ success: true, jobs: jobsForEnrolledCycles });
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