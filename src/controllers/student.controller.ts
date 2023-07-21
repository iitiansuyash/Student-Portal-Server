import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/student.service';
import { studentRepository } from "../repositories/student.repository";
import { Student } from '../entity/Student';
import { Student_Studies_Spec } from '../entity/StudentStudiesSpec';
import { Graduation_Year } from '../entity/Graduation_Year';
import { Student_cvs } from '../entity/Student_cvs';
import { Placement_Cycle_Enrolment } from '../entity/Placement_Cycle_Enrolment';
import { Edu_History } from '../entity/Edu_History';
import { AppDataSource } from '../data-source';

interface CreateStudentBody {
    admno: string,
    first_name: string,
    middle_name: string,
    last_name: string,
    phonePref: string,
    phone: string,
    dob: Date,
    gender: string,
    category: string,
    instiMailId: string,
    personalMailId: string,
    isPWD: number,
    isEWS: number,
    permissions: number,
    uidType: string,
    uidValue: string,
}

const createNewStudentData = (studentData: CreateStudentBody): Student => {
    let student = new Student();
    student = { ...student, ...studentData };
    return student;
}

const createNewStudentProfile = (Data : any) : Student => {
    const StudentData = new Student();

    StudentData.admno =Data.admno
    StudentData.first_name = Data.name
    StudentData.middle_name = ""
    StudentData.last_name = ""
    StudentData.phonePref = "91"
    StudentData.phone = Data.contact
    StudentData.dob = Data.dateofbirth as Date
    StudentData.gender = Data.gender
    StudentData.instiMailId = Data.email
    StudentData.personalMailId = Data.personalemail
    StudentData.isPWD = Data.pwd=="No"?0:1
    StudentData.category = Data.category
    StudentData.isEWS = Data.ewsgeneral=="No"?0:1
    StudentData.uidType = ""
    StudentData.uidValue = ""
    StudentData.isRegistered=1

    return StudentData;
}

const createNewStudentPlacementEnrolmentCycle = (Data : any) : Placement_Cycle_Enrolment => {
    const createNewStudentPlacementEnrolmentCycleData = new Placement_Cycle_Enrolment();

    createNewStudentPlacementEnrolmentCycleData.placementCycleId = Data.placementCycleId as number
    createNewStudentPlacementEnrolmentCycleData.admno=Data.admno

    return createNewStudentPlacementEnrolmentCycleData;
}

const createNewStudentStudiesSpecData = (Data : any) : Student_Studies_Spec => {
    const StudentStudiesSpec = new Student_Studies_Spec();

    StudentStudiesSpec.isParent = 0
    StudentStudiesSpec.marksheetLink = "marksheetLink"
    StudentStudiesSpec.cgpaValue = Data.percentage as number
    StudentStudiesSpec.cgpaScale = 10
    StudentStudiesSpec.totalBacklogs = 0
    StudentStudiesSpec.activeBacklogs = 0

    return StudentStudiesSpec;
}

const createNewStudentcvsData = (Data : any) : Student_cvs => {
    const createStudentcvsData = new Student_cvs();

    createStudentcvsData.cvLink = "link"

    return createStudentcvsData;
}


const createNewStudentGraduationData = (Data : any) : Graduation_Year => {
    const createStudentGraduationData = new Graduation_Year();

    createStudentGraduationData.year = Data.graduationyear as string

    return createStudentGraduationData;
}

const createNewStudentEdu_History10Data = (Data : any) : Edu_History => {
    const createNewStudentEdu_HistoryData = new Edu_History();

    createNewStudentEdu_HistoryData.marksheetLink = "marksheetLink"
    createNewStudentEdu_HistoryData.cgpaValue = Data.class10cgpa==""?0:Data.class10cgpa as number
    createNewStudentEdu_HistoryData.cgpaScale = Data.class10score==""?0:Data.class10score as number
    createNewStudentEdu_HistoryData.gradeEquivalent = Data.class10grade as string
    createNewStudentEdu_HistoryData.percentEquivalent = Data.class10percentage==""?0:Data.class10percentage as number
    createNewStudentEdu_HistoryData.conversionProof = "marksheetLink"
    createNewStudentEdu_HistoryData.startYearMonth = Data.class10durationfrom as Date
    createNewStudentEdu_HistoryData.endYearMonth = Data.class10durationto as Date
    createNewStudentEdu_HistoryData.institution = Data.class10schoolname
    createNewStudentEdu_HistoryData.university = Data.class10boards
    createNewStudentEdu_HistoryData.lastEditDate = new Date()
    createNewStudentEdu_HistoryData.lastVerifiedDate = new Date()
    createNewStudentEdu_HistoryData.isFrozen = 0
    createNewStudentEdu_HistoryData.degreeId = 1
    createNewStudentEdu_HistoryData.degreeName = "10th"

    return createNewStudentEdu_HistoryData;
}

const createNewStudentEdu_History12Data = (Data : any) : Edu_History => {
    const createNewStudentEdu_HistoryData = new Edu_History();

    createNewStudentEdu_HistoryData.marksheetLink = "marksheetLink"
    createNewStudentEdu_HistoryData.cgpaValue = Data.class12cgpa==""?0:Data.class12cgpa as number
    createNewStudentEdu_HistoryData.cgpaScale = Data.class12score==""?0:Data.class12score as number
    createNewStudentEdu_HistoryData.gradeEquivalent = Data.class12grade as string
    createNewStudentEdu_HistoryData.percentEquivalent =Data.class12percentage==""?0:Data.class12percentage as number
    createNewStudentEdu_HistoryData.conversionProof = "marksheetLink"
    createNewStudentEdu_HistoryData.startYearMonth = Data.class12durationfrom as Date
    createNewStudentEdu_HistoryData.endYearMonth = Data.class12durationto as Date
    createNewStudentEdu_HistoryData.institution = Data.class12schoolname
    createNewStudentEdu_HistoryData.university = Data.class12boards
    createNewStudentEdu_HistoryData.lastEditDate = new Date()
    createNewStudentEdu_HistoryData.lastVerifiedDate = new Date()
    createNewStudentEdu_HistoryData.isFrozen = 0
    createNewStudentEdu_HistoryData.degreeId = 2
    createNewStudentEdu_HistoryData.degreeName = "12th"

    return createNewStudentEdu_HistoryData;
}

export const createStudentProfile = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<Student | void> => {

    const admno = req['user'].admno;

    try {

        // const {name, dateofbirth, gender, category, contact, email, personalemail,
        //     permanentaddress, currentaddress, fathername, aadhar, ewsgeneral, pwd,
        //     class10schoolname, class10durationfrom, class10durationto, class10boards,
        //     class10percentage, class10cgpa, class10score, class10grade, class10gradesheet,
        //     class12schoolname, class12durationfrom,class12durationto, class12boards,
        //     class12percentage, class12cgpa, class12score, class12grade, class12gradesheet, 
        //     graduationyear, degree, currentsemester, presenteducationdurationfrom, presenteducationdurationto,
        //     percentage, gradesheet, resume}=req.body

        const placementCycleId = await AppDataSource.query(`
        SELECT placementCycleId
        FROM placementcycle
        WHERE graduatingYear = ${req.body.graduationyear}`)

        req.body["admno"]=admno
        req.body["placementCycleId"]=placementCycleId[0].placementCycleId

        const cv = createNewStudentcvsData(req.body)
        const edu_history_10 = createNewStudentEdu_History10Data(req.body)
        const edu_history_12 = createNewStudentEdu_History12Data(req.body)
        const study = createNewStudentStudiesSpecData(req.body)
        const placementCycle = createNewStudentPlacementEnrolmentCycle(req.body)
        const graduation = createNewStudentGraduationData(req.body)

        const student=createNewStudentProfile(req.body)

        student.cvs=[cv]
        student.edu_historys=[edu_history_10,edu_history_12]
        student.specializations=[study]
        student.placementcycles=[placementCycle]
        student.graduatingYear=graduation

        console.log(student)

        const newStudent = await userService.create(student);

        res.status(200).json({ success: true , message:"Profiled created successfully"});
    } catch (error) {
        return next(error);
    }
}

export const fetchStudentProfile = async (
    req: Request, 
    res: Response, 
    next: NextFunction): Promise<Student | void> => {
    
    const admno = req['user'].admno;

    try {

        const student_profile = await studentRepository
        .createQueryBuilder("student")
        .leftJoinAndSelect("student.graduatingYear", "graduation_year")
        .leftJoinAndSelect("student.cvs", "student_cvs")
        .leftJoinAndSelect("student.placementcycles", "placementcycle")
        .leftJoinAndSelect("student.specializations", "student_studies_spec")
        .leftJoinAndSelect("student.edu_historys", "edu_history")
        .leftJoinAndSelect("student.semwise_gpas", "studies_semwise_cgpa")
        .where("student.admno = :admno", { admno })
        .getOne();

        res.status(200).json({ success: true, student_profile : student_profile});
    } catch (error) {
        return next(error);
    }
}

export const findStudentById = async (req: Request, res: Response, next: NextFunction): Promise<Student | void> => {
    
    const admno = req.params?.admno;

    try {

        const student = await userService.fetchStudent(admno);

        if (!student)
            return next('Student not found');

        res.status(200).json({ success: true,message : student });
    } catch (error) {
        return next(error);
    }
}

export const createStudent = async (req: Request, res: Response, next: NextFunction): Promise<Student | void> => {
    const studentData: CreateStudentBody = req.body;

    try {
        const student = await userService.create(await createNewStudentData(studentData));

        res.status(200).json({ success: true, student });
    } catch (error) {
        return next(error);
    }
}

export const fetchAllStudents = async (req: Request, res: Response, next: NextFunction): Promise<Student | void> => {
    try {
        const students = await userService.findAll();

        res.status(200).json({ success: true, students });
    } catch (error) {
        return next(error);
    }
}

export const createBulk = async (req: Request, res: Response, next: NextFunction): Promise<Student[] | void> => {
    const students = req.body;

    try {
        await students.map(async (user: CreateStudentBody) => await userService.create(await createNewStudentData(user)));

        res.status(200).json({ success: true, message: 'Users added successfully' });
    } catch (error) {
        return next(error);
    }
}

export const deleteStudent = async (req: Request, res: Response, next: NextFunction): Promise<Student | void> => {
    const admno = req.params.admno;

    try {
        const student = await userService.remove(admno);

        res.status(200).json({ success: true, student });
    } catch (error) {
        return next(error);
    }
}
