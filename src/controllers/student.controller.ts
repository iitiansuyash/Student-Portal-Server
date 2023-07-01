import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/student.service';
import { Student } from '../entity/Student';

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

const createNewStudentData = (studentData: CreateStudentBody) : Student => {
    let student = new Student();
    student = { ...student, ...studentData };
    return student;
}

export const createStudentProfile = async (
    req: Request, 
    res: Response, 
    next: NextFunction) : Promise<Student | void> => {
    try {
        
        

        res.status(200).json({ success: true});
    } catch (error) {
        return next(error);
    }
}

export const findStudentById = async (req: Request, res: Response, next: NextFunction) : Promise<Student | void> => {
    const admno = req.params?.admno;

    try {
        const student = await userService.fetchStudent(admno);

        if(!student)
        return next('Student not found');

        res.status(200).json({ success: true, student });
    } catch (error) {
        return next(error);
    }
}

export const createStudent = async (req: Request, res: Response, next: NextFunction) : Promise<Student | void> => {
    const studentData: CreateStudentBody = req.body;

    try {
        const student = await userService.create(await createNewStudentData(studentData));

        res.status(200).json({ success: true, student });
    } catch (error) {
        return next(error);
    }
}

export const fetchAllStudents = async (req: Request, res: Response, next: NextFunction) : Promise<Student | void> => {
    try {
        const students = await userService.findAll();

        res.status(200).json({ success: true, students });
    } catch (error) {
        return next(error);
    }
}

export const createBulk = async (req: Request, res: Response, next: NextFunction) : Promise<Student[] | void> => {
    const students = req.body;

    try {
        await students.map(async (user: CreateStudentBody) => await userService.create(await createNewStudentData(user)));

        res.status(200).json({ success: true, message: 'Users added successfully' });
    } catch (error) {
        return next(error);
    }
}

export const deleteStudent = async (req: Request, res: Response, next: NextFunction) : Promise<Student | void> => {
    const admno = req.params.admno;

    try {
        const student = await userService.remove(admno);

        res.status(200).json({ success: true, student });
    } catch (error) {
        return next(error);
    }
}
