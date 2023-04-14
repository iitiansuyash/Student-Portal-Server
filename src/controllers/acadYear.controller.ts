import { NextFunction, Request, Response } from 'express';
import { Academic_Year } from '../entity/Academic_Year';
import { AppDataSource } from '../data-source';

export const fetchCurrentAcadYear = async (req: Request, res: Response, next: NextFunction) : Promise<Academic_Year | void> => {
    try {
        const acadYear = await AppDataSource.query(`
            SELECT * FROM academic_year WHERE isCurrent = 1
        `);

        res.status(201).json({ success: true, acadYear: acadYear[0] });
    } catch (error) {
        return next(error);
    }
}

export const fetchAllAcadYears = async (req: Request, res: Response, next: NextFunction) : Promise<Academic_Year[] | void> => {
    try {
        const acadYears = await AppDataSource.query(`SELECT * FROM academic_year`);

        res.status(201).json({ success: true, acadYears });
    } catch (error) {
        return next(error);
    }
}