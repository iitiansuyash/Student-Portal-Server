import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";
import { NF_Branch_Eligibility } from "../entity/NF_Branch_Eligibility";
import { NF_Job_Stages } from "../entity/NF_Job_Stages";
import { Notification_Form } from "../entity/Notification_Form";
import { UserRequest } from "../middleware/isAuthorized";
import { NF_Repository } from "../repositories/job.repository";
import { createNF, fetchNF, removeNF, updateNF } from "../services/nf.service";

const createCompanyData = (company_details) => {
  const company = new Company();

  company.companyId = company_details.companyId;
  company.companyName = company_details.companyName;
  company.companyWebsite = company_details.companyWebsite;
  company.category = company_details.category;
  company.sector = company_details.sector;

  return company;
};

const createEligibilityData = (eligible_courses, nfId?) => {
  const eligibilityList = [];

  eligible_courses.forEach((eligible_course) => {
    const course = new NF_Branch_Eligibility();
    course.nfId = nfId;
    course.spec = eligible_course.spec;
    course.minLPA = eligible_course.minLPA;
    course.maxLPA = eligible_course.maxLPA;
    course.cgpaValue = eligible_course.cgpaValue;

    eligibilityList.push(course);
  });

  return eligibilityList;
};

const createStagesData = (schedule, nfId?) => {
  const stagesList = [];

  schedule.forEach((step, index) => {
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

const createNewNF = (job) => {
  const newNF = new Notification_Form();

  const { company, nfEligibility, nf_stages, placementCycle } = job;

  newNF.type = job.type;
  newNF.profile = job.profile;
  newNF.placeOfPosting = job.placeOfPosting;
  newNF.jobDescription = job.jobDescription;
  newNF.modeOfInternship = job.modeOfInternship;
  newNF.ctcBreakup = job.ctcBreakup;
  newNF.bondDetails = job.bondDetails;
  newNF.hasPPO = job.hasPPO;
  newNF.ismOffersMax = job.ismOffersMax;
  newNF.ismOffersMin = job.ismOffersMin;
  newNF.cdcInformation = "Nope";
  newNF.deadline = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days from creation
  newNF.company = createCompanyData(company);
  newNF.nfEligibility = createEligibilityData(nfEligibility);
  newNF.nf_stages = createStagesData(nf_stages);
  newNF.nfHistoryCriteria = [];
  newNF.nf_docs = [];
  newNF.placementCycle = placementCycle;
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

    const jobsForSelectedCycle = await NF_Repository.createQueryBuilder(
      "Notification_Form"
    )
      .where(`Notification_Form.placementCycleId = ${placementCycleId}`)
      .leftJoinAndSelect("Notification_Form.company", "Company")
      .getMany();

    res.status(200).json({ success: true, jobs: jobsForSelectedCycle });
  } catch (error) {
    return next(error);
  }
};

export const createNewJob = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Notification_Form | void> => {
  try {
    const job = req.body;

    const newJob = await createNF(createNewNF(job));

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
