import { NextFunction, Request, Response } from 'express';
import { Department } from '../entity/Department';
import { Department_Repository } from '../repositories/department.repository';

const deptData = (deptName: string) => {
    const dept = new Department();

    dept.deptName = deptName;

    return dept;
}

export const fetchAllDepartments = async (req: Request, res: Response, next: NextFunction) : Promise<Department | void> => {
    try {
        const departments = await Department_Repository.find();

        res.status(201).json({ success: true, departments });
    } catch (error) {
        return next(error);
    }
}

export const createDepartment = async (req: Request, res: Response, next: NextFunction) : Promise<Department | void> => {
    try {
        const { deptName } = req.body;

        const department = await Department_Repository.save(deptData(deptName));

        res.status(201).json({ success: true, department });
    } catch (error) {
        return next(error);
    }
}