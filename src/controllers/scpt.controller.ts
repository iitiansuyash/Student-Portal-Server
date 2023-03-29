import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Scpt } from "../entity/Scpt";

export const fetchAllScpts = async (req: Request, res: Response, next: NextFunction) : Promise<Scpt[] | void> => {
    try {
        const scpts = await AppDataSource.query(`SELECT * FROM scpt`);

        res.status(201).json({ success: true, scpts });
    } catch (error) {
        return next(error);
    }
}