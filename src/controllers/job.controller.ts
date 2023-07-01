import { NextFunction, Request, Response, application } from "express";
import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";
import { NF_Branch_Eligibility } from "../entity/NF_Branch_Eligibility";
import { NF_Job_Stages } from "../entity/NF_Job_Stages";
import { Notification_Form } from "../entity/Notification_Form";
import { NF_Supporting_Docs } from "../entity/NF_Supporting_Docs";
import { UserRequest } from "../middleware/isAuthorized";
import { NF_Repository } from "../repositories/job.repository";
import { createNF, fetchNF, removeNF, updateNF ,createApplication} from "../services/nf.service";
import { Notification_Form_spoc } from "../entity/Notification_Form_spoc";
import { HR_POC_NF } from "../entity/HR_POC_NF";
import { NF_Applications } from "../entity/NF_Applications";
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
  const eligibilityList = [];

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
  const stagesList = [];

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
  const docsList = [];

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
  const spocList = [];

  spocs?.forEach(spoc => {
    const newSpoc = new Notification_Form_spoc();

    newSpoc.nfId = nfId;
    newSpoc.scpt = spoc.scpt;
    newSpoc.isPrimary = spoc.isPrimary;
    if(newSpoc.scpt)
    spocList.push(newSpoc);
  });

  return spocList;
}

const createHRData = (hrs) => {
  const hrList = [];

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

const _jobsForEnrolledCycles = async(admno)=>{

  const placementCycles = await AppDataSource.getRepository(
    "Placement_Cycle_Enrolment"
  )
    .createQueryBuilder("Placement_Cycle_Enrolment")
    .where(`Placement_Cycle_Enrolment.student = '${admno}'`)
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

  return jobsForEnrolledCycles;
}

const isEligible = async(admno,jobId)=>{

  const hiringWrokflow = await AppDataSource.query(`
      SELECT stages.seqNo, stageType, stageMode, isCompleted, isSelected, listtype, isFinalRound
      FROM nf_job_stages AS stages
      LEFT JOIN nf_shortlisting AS shortlist
      ON stages.seqNo = shortlist.seqNo and
      shortlist.admno = "${admno}"
      WHERE stages.nfId = ${jobId} 
    `)

    let studentInfo = await AppDataSource.query(`
      SELECT placementCycleId, gender, isPWD, isEWS, category, specName, student_studies_spec.cgpaValue, activeBacklogs, totalBacklogs, degreeId, percentEquivalent
      FROM studentportal.student, studentportal.specialization, studentportal.student_studies_spec, studentportal.edu_history, studentportal.placement_cycle_enrolment
      WHERE student.admno = "${admno}" 
      and student_studies_spec.admno = "${admno}" 
      and specialization.specId = student_studies_spec.specId
      and edu_history.admno = "${admno}" 
      and placement_cycle_enrolment.admno = "${admno}"
    `)

    let jobEligibility = await AppDataSource.query(`
      SELECT specName, cgpaValue, degreeId, percentEquivalent, placementCycleId
      FROM studentportal.NF_Branch_Eligibility, studentportal.specialization, studentportal.nf_history_criteria, studentportal.notification_form
      WHERE NF_Branch_Eligibility.nfId = ${jobId} 
      and specialization.specId = NF_Branch_Eligibility.specId
      and nf_history_criteria.nfId = ${jobId} 
      and notification_form.nfId = ${jobId} 
    `)

  // Eligibility Check :

   // -> PlacementCylce Eligibility 
   if(studentInfo[0].placementCycleId!=jobEligibility[0].placementCycleId)
    return 0;
  // -> Is Already Placed
  let b=true;
  for(let stage in hiringWrokflow)
    if(hiringWrokflow[stage].isFinalRound&&hiringWrokflow[stage].isSelected)
      b=false;
  if(!b)
    return 0;

  // -> Backlog Eligibility
  if(studentInfo[0].activeBacklogs!=0)
    return 0;

  // -> Course Eligibility
  b=false;
  for(let i in jobEligibility)
      if(jobEligibility[i].specName == studentInfo[0].specName)
        {b=true;break};
  if(!b)
    return 0;

  // -> Acadamic Eligibility 
  if(jobEligibility[0].cgpaValue>studentInfo[0].cgpaValue)
    return 0;

  // -> Education_History Eligibility
  let n = jobEligibility.length

  if(jobEligibility[0].percentEquivalent>studentInfo[0].percentEquivalent)
    return 0;

  if(jobEligibility[n-1].percentEquivalent>studentInfo[1].percentEquivalent)
    return 0;
  return 1;
}

const isApplied = async(admno,nfId)=>{

  const application = await AppDataSource.query(`
    SELECT * 
    FROM nf_applications
    WHERE nf_applications.nfId = ${nfId} and nf_applications.admno = "${admno}"
  `)

  if(application.length)
    return 1;
  return 0;
}

const isOpen = async(deadline)=>{
  if(deadline.getTime()>(new Date()).getTime())
    return 1;
  return 0;
}

export const fetchAllJobsForStudent = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Notification_Form | void> => {
  try {

    const jobsForEnrolledCycles = await _jobsForEnrolledCycles(req?.user?.admno);

    for(let job in jobsForEnrolledCycles)
    {
      jobsForEnrolledCycles[job]["is_eligible"] = await isEligible(req?.user?.admno,jobsForEnrolledCycles[job].nfId);
      jobsForEnrolledCycles[job]["is_applied"] = await isApplied(req?.user?.admno,jobsForEnrolledCycles[job].nfId);
      jobsForEnrolledCycles[job]["is_open"] = await isOpen(jobsForEnrolledCycles[job].deadline);
    }

    res.status(200).json({ success: true, jobs: jobsForEnrolledCycles });
  } catch (error) {
    return next(error);
  }
};

export const fetchJobByIdForStudent=async(
  req:Request,
  res:Response,
  next:NextFunction
):Promise<Notification_Form | void> =>{
  try
  {

    const {jobId} = req.params;

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

    let studentInfo = await AppDataSource.query(`
      SELECT placementCycleId, gender, isPWD, isEWS, category, specName, student_studies_spec.cgpaValue, activeBacklogs, totalBacklogs, degreeId, percentEquivalent
      FROM studentportal.student, studentportal.specialization, studentportal.student_studies_spec, studentportal.edu_history, studentportal.placement_cycle_enrolment
      WHERE student.admno = "${req['user'].admno}" 
      and student_studies_spec.admno = "${req['user'].admno}" 
      and specialization.specId = student_studies_spec.specId
      and edu_history.admno = "${req['user'].admno}" 
      and placement_cycle_enrolment.admno = "${req['user'].admno}"
    `)

    let jobEligibility = await AppDataSource.query(`
      SELECT specName, cgpaValue, degreeId, percentEquivalent, placementCycleId
      FROM studentportal.NF_Branch_Eligibility, studentportal.specialization, studentportal.nf_history_criteria, studentportal.notification_form
      WHERE NF_Branch_Eligibility.nfId = ${jobId} 
      and specialization.specId = NF_Branch_Eligibility.specId
      and nf_history_criteria.nfId = ${jobId} 
      and notification_form.nfId = ${jobId} 
    `)

    // Eligibility Check :

    // -> Profile Verification Eligibility
    let is_profile_verified = {is_eligible : true, message : "Profile Verified"}
  
    // -> PlacementCylce Eligibility 
    let placement_cycle_eligibility = {is_eligible : true, message : "Eligible for this Placement Cycle"}
    if(studentInfo[0].placementCycleId!=jobEligibility[0].placementCycleId)
      placement_cycle_eligibility = {is_eligible : false, message : "Not Eligible for this Placement Cycle"};

    // -> Is Already Placed
    let is_not_palced = {is_eligible : true ,message : "Eligible for this job"}
    let b=true;
    for(let stage in hiring_wrokflow)
      if(hiring_wrokflow[stage].isFinalRound&&hiring_wrokflow[stage].isSelected)
        b=false;
    if(!b)
      is_not_palced = {is_eligible : false ,message : "Not Eligible for this job"};

    // -> Backlog Eligibility
    let backlog_eligibility;
    if(studentInfo[0].activeBacklogs!=0)
      backlog_eligibility = {is_eligible : false, 
        message : `ActiveBacklogs : ${studentInfo[0].activeBacklogs} , TotalBacklogs : ${studentInfo[0].totalBacklogs}`}
    else
      backlog_eligibility = {is_eligible : true, message : "No backlogs"};

    // -> Course Eligibility
    let course_eligibility = {is_eligible : true, message : "Criteria satisfied"}
    b=false;
    for(let i in jobEligibility)
        if(jobEligibility[i].specName == studentInfo[0].specName)
          {b=true;break};
    if(!b)
      course_eligibility = {is_eligible : false, message : "Criteria not satisfied"};

    // -> Acadamic Eligibility 
    let  academic_eligibility = {is_eligible : true, 
      message : `Required : ${jobEligibility[0].cgpaValue} , Actual : ${studentInfo[0].cgpaValue}`};
      if(jobEligibility[0].cgpaValue>studentInfo[0].cgpaValue)
      academic_eligibility = {is_eligible : false,
        message : `Required : ${jobEligibility[0].cgpaValue} , Actual : ${studentInfo[0].cgpaValue}`}

    // -> Education_History Eligibility
    let n = jobEligibility.length

    let edu_history_10_eligibility = {is_eligible : true ,
      message : `Required : ${jobEligibility[n-1].percentEquivalent} , Actual : ${studentInfo[1].percentEquivalent}`}
    if(jobEligibility[0].percentEquivalent>studentInfo[0].percentEquivalent)
      edu_history_10_eligibility = {is_eligible : false ,
        message : `Required : ${jobEligibility[n-1].percentEquivalent} , Actual : ${studentInfo[1].percentEquivalent}`};

    let edu_history_12_eligibility = {is_eligible : true ,message : 
      `Required : ${jobEligibility[n-1].percentEquivalent} , Actual : ${studentInfo[1].percentEquivalent}`}
    if(jobEligibility[n-1].percentEquivalent>studentInfo[1].percentEquivalent)
      edu_history_12_eligibility = {is_eligible : false ,message :
        `Required : ${jobEligibility[n-1].percentEquivalent} , Actual : ${studentInfo[1].percentEquivalent}`}
    
    res.status(201).json({ success: true, 
      job_description : job_description?.[0],
      additional_documents:additional_documents,
      hiring_wrokflow : hiring_wrokflow,
      studentInfo : studentInfo[1],
      eligibility_criteria : {
        is_profile_verified : is_profile_verified,
        placement_cycle_eligibility : placement_cycle_eligibility,
        is_not_palced : is_not_palced,
        backlog_eligibility : backlog_eligibility,
        course_eligibility : course_eligibility,
        academic_eligibility : academic_eligibility,
        edu_history_10_eligibility : edu_history_10_eligibility,
        edu_history_12_eligibility : edu_history_12_eligibility}
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
    const {jobId} = req.params;

    if(!isEligible(req['user'].admno,jobId)||isApplied(req['user'].admno,jobId)||!isOpen(jobId))
      res.status(200).json({ success: false, application :"Not Applicable for Job" });
    else{
    const application = new NF_Applications
    application.nfId = parseInt(jobId)
    application.admno = req['user'].admno
    application.addedByAdmin=0
    const job = await createApplication(application)

    res.status(200).json({ success: true, application :job });}
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

export const searchJobsForAdmin = async (req: Request, res: Response, next: NextFunction) : Promise<Notification_Form | void> => {
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
    await AppDataSource.getRepository("NF_Branch_Eligibility").remove(
      newJob.nfEligibility
    );
    await AppDataSource.getRepository("NF_Branch_Eligibility").save(
      createEligibilityData(nfEligibility, parseInt(jobId))
    );

    // updating nf_stages section
    await AppDataSource.getRepository("NF_Job_Stages").remove(newJob.nf_stages);
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
