import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";

const courseData = (courseName: string, duration: string) => {
    const course = new Course();

    course.courseName = courseName;
    course.duration = duration;

    return course;
}

export const fetchAllCourses = async (req: Request, res: Response, next: NextFunction) : Promise<Course[] | void> => {
    try {
        const courses = await AppDataSource.query(`SELECT * FROM course`);

        res.status(201).json({ success: true, courses });
    } catch (error) {
        return next(error);
    }
}

export const createCourse = async (req: Request, res: Response, next: NextFunction) : Promise<Course | void> => {
    try {
        const { courseName, duration } = req.body;
        const course = await AppDataSource.getRepository(Course).save(courseData(courseName, duration));

        res.status(201).json({ success: true, course });
    } catch (error) {
        return next(error);
    }
}