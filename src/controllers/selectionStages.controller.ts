import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Selection_Stages } from "../entity/Selection_Stages";


export const fetchAllStages = async (req: Request, res: Response, next: NextFunction) : Promise<Selection_Stages | void> => {
    try {
        const stages = await AppDataSource.query(`SELECT * FROM selection_stages`);

        res.status(201).json({ success: true, stages });
    } catch (error) {
        return next(error);
    }
}