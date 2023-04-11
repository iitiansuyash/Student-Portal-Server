import { NextFunction, Request, Response } from 'express';
import { Department } from '../entity/Department';
import { Department_Repository } from '../repositories/department.repository';


export const fetchAllDepartments = async (req: Request, res: Response, next: NextFunction) : Promise<Department | void> => {
    try {
        const departments = await Department_Repository.find();

        res.status(201).json({ success: true, departments });
    } catch (error) {
        return next(error);
    }
}