import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";

export const fetchAllCourses = async (req: Request, res: Response, next: NextFunction) : Promise<Course[] | void> => {
    try {
        const courses = await AppDataSource.query(`SELECT * FROM course`);

        res.status(201).json({ success: true, courses });
    } catch (error) {
        return next(error);
    }
}