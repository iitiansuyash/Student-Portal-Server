import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Specialization } from "../entity/Specialization";


export const fetchSpecializationForCourse = async (req: Request, res: Response, next: NextFunction) : Promise<Specialization[] | void> => {
    try {
        const { courseIds, acadYear } = req.body;
        const specializations = await AppDataSource.query(`
            SELECT s.*, d.disciplineName, d.departmentId, d.courseId, c.courseName AS courseName, dept.deptName as departmentName, soa.acadYear
            FROM specialization AS s
            LEFT JOIN discipline AS d
            ON d.disciplineId = s.disciplineId
            LEFT JOIN department AS dept
            ON d.departmentId = dept.deptId
            LEFT JOIN course AS c
            ON d.courseId = c.courseId
            LEFT JOIN spec_offered_acadyear as soa
            ON soa.specId = s.specId
            WHERE (c.courseId IN (${courseIds})) AND (soa.acadYear = "${acadYear}")
        `);

        res.status(201).json({ success: true, specializations });
    } catch (error) {
        return next(error);
    }
}