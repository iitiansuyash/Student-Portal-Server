import { NextFunction, Request, Response } from 'express';
import { Role } from '../entity/Role';
import * as roleService from '../services/role.service';

const createNewRole = (name: string) : Role => {
    const role = new Role();
    role.name = name;
    return role;
}

export const createRole = async (req: Request, res: Response, next: NextFunction) : Promise<Role | any> => {
    const { name } = req.body;

    try {
        
        const role = await roleService.create(createNewRole(name));

        res.status(200).json({ success: true, role });
    } catch (error) {
        return next(error);
    }
}