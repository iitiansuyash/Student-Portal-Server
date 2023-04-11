import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Placementcycle } from "../entity/Placementcycle";
import { UserRequest } from "../middleware/isAuthorized";

export const fetchAllPlacementCycles = async (req: Request, res: Response, next: NextFunction) : Promise<Placementcycle | void> => {
    try {
        const cycles = await AppDataSource.query(`SELECT * FROM placementcycle`);

        res.status(201).json({ success: true, cycles });
    } catch (error) {
        return next(error);
    }
}

export const fetchEnrolledPlacementCycle = async (req: UserRequest, res: Response, next: NextFunction) : Promise<Placementcycle | void> => {
    try {

        const admno = req?.user?.admno;

        const cycles = await AppDataSource.query(`
            SELECT * FROM placementcycle AS pc
            WHERE pc.placementCycleId IN (
                SELECT DISTINCT pce.placementCycleId
                FROM placement_cycle_enrolment as pce
                WHERE pce.admno = '${admno}'
            )
        `)

        res.status(201).json({ success: true, cycles });
    } catch (error) {
        return next(error);
    }
}