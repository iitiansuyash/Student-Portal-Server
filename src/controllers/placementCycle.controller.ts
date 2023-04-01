import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Placementcycle } from "../entity/Placementcycle";

export const fetchAllPlacementCycles = async (req: Request, res: Response, next: NextFunction) : Promise<Placementcycle | void> => {
    try {
        const cycles = await AppDataSource.query(`SELECT * FROM placementcycle`);

        res.status(201).json({ success: true, cycles });
    } catch (error) {
        return next(error);
    }
}