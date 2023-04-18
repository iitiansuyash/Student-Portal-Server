import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Specialization } from "../entity/Specialization";

const specializationData = (specData) => {
    const specialization = new Specialization();

    specialization.specName = specData.specName;
    specialization.discipline = specData.discipline;

    return specialization;
}


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

export const createSpecialization = async (req: Request, res: Response, next: NextFunction) : Promise<Specialization | void> => {
    try {
        const specData = req.body;
        const specialization = await AppDataSource.getRepository(Specialization).save(specializationData(specData));

        res.status(201).json({ success: true, specialization });
    } catch (error) {
        return next(error);
    }
}