import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";
import { NF_Branch_Eligibility } from "../entity/NF_Branch_Eligibility";
import { NF_Job_Stages } from "../entity/NF_Job_Stages";
import { Notification_Form } from "../entity/Notification_Form";
import { NF_Supporting_Docs } from "../entity/NF_Supporting_Docs";
import { NF_Repository } from "../repositories/job.repository";
import { Notification_Form_spoc } from "../entity/Notification_Form_spoc";
import { HR_POC_NF } from "../entity/HR_POC_NF";

export const createCompanyData = (company_details) => {
    const company = new Company();

    // company.companyId = company_details.companyId;
    company.companyName = company_details.companyName;
    company.companyWebsite = company_details.companyWebsite;
    company.category = company_details.category;
    company.sector = company_details.sector;

    return company;
};

export const createEligibilityData = (eligible_courses, nfId?) => {
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

export const createStagesData = (schedule, nfId?) => {
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

export const createDocsData = (docs, nfId?) => {
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

export const createSpocData = (spocs, nfId?) => {
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

export const createHRData = (hrs) => {
    const hrList: HR_POC_NF[] = [];

    hrs?.forEach((hr) => {
        const newHr = new HR_POC_NF();

        newHr.hr = hr.hr;
        newHr.isPrimary = hr.isPrimary;

        hrList.push(newHr);
    })

    return hrList;
}

export const createNewNF = (job) => {
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

export const _jobsForEnrolledCycles = async (admno) => {

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

export const isEligible = async (admno, jobId) => {

    const hiringWrokflow = await AppDataSource.query(`
        SELECT stages.seqNo, stageType, stageMode, isCompleted, isSelected, listtype, isFinalRound
        FROM nf_job_stages AS stages
        LEFT JOIN nf_shortlisting AS shortlist
        ON stages.seqNo = shortlist.seqNo and
        shortlist.admno = "${admno}"
        WHERE stages.nfId = ${jobId} 
      `)

    const studentInfo = await AppDataSource.query(`
        SELECT placementCycleId, gender, isPWD, isEWS, category, specName, student_studies_spec.cgpaValue, activeBacklogs, totalBacklogs, degreeId, percentEquivalent
        FROM studentportal.student, studentportal.specialization, studentportal.student_studies_spec, studentportal.edu_history, studentportal.placement_cycle_enrolment
        WHERE student.admno = "${admno}" 
        and student_studies_spec.admno = "${admno}" 
        and specialization.specId = student_studies_spec.specId
        and edu_history.admno = "${admno}" 
        and placement_cycle_enrolment.admno = "${admno}"
      `)

    const jobEligibility = await AppDataSource.query(`
        SELECT specName, cgpaValue, degreeId, percentEquivalent, placementCycleId
        FROM studentportal.NF_Branch_Eligibility, studentportal.specialization, studentportal.nf_history_criteria, studentportal.notification_form
        WHERE NF_Branch_Eligibility.nfId = ${jobId} 
        and specialization.specId = NF_Branch_Eligibility.specId
        and nf_history_criteria.nfId = ${jobId} 
        and notification_form.nfId = ${jobId} 
      `)

      console.log(jobEligibility)
      console.log(studentInfo)

    // Eligibility Check :

    // -> PlacementCylce Eligibility 
    if (studentInfo[0].placementCycleId != jobEligibility[0].placementCycleId)
        return false;

    // -> Is Already Placed
    let b = true;
    for (const stage in hiringWrokflow)
        if (hiringWrokflow[stage].isFinalRound && hiringWrokflow[stage].isSelected)
            b = false;
    if (!b)
        return false;

    // -> Backlog Eligibility
    if (studentInfo[0].activeBacklogs != 0)
        return false;

    // -> Course Eligibility
    b = false;
    for (const i in jobEligibility)
        if (jobEligibility[i].specName == studentInfo[0].specName) { b = true; break }
    if (!b)
        return false;

    // -> Acadamic Eligibility 
    if (jobEligibility[0].cgpaValue > studentInfo[0].cgpaValue)
        return false;

    // -> Education_History Eligibility
    const n = jobEligibility.length

    if (jobEligibility[0].percentEquivalent > studentInfo[0].percentEquivalent)
        return false;

    if (jobEligibility[n - 1].percentEquivalent > studentInfo[1].percentEquivalent)
        return false;
    return true;
}

export const isApplied = async (admno, nfId) => {

    const _application = await AppDataSource.query(`
      SELECT * 
      FROM nf_applications
      WHERE nf_applications.nfId = ${nfId} and nf_applications.admno = "${admno}"
    `)

    if (_application.length)
        return true;
    return false;
}

export const isOpen = (deadline) => {
    if (deadline.getTime() > (new Date()).getTime())
        return true;
    return false;
}