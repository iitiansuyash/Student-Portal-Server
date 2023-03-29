import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/Student";

export const fetchAllCategories = async (req: Request, res: Response, next: NextFunction) : Promise<Category[] | void> => {
    try {
        const categories = await AppDataSource.query(`SELECT * FROM companyCategories`);

        res.status(201).json({ success: true, categories });
    } catch (error) {
        return next(error);
    }
}