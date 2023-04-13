import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Placementcycle } from "../entity/Placementcycle";
import { UserRequest } from "../middleware/isAuthorized";
import * as placementCycleService from '../services/placementcycle.service';
import { Specialization_Placementcycle_rel } from '../entity/Specialization_placementcycle_rel';
import { Academic_Year } from '../entity/Academic_Year';

const createCycleSpecRel = (spec) => {
    const specRel = new Specialization_Placementcycle_rel();

    specRel.specialization = spec;

    return specRel;
}

const createAcadYear = (year) => {
    const acadYear = new Academic_Year();

    acadYear.year = year;

    return acadYear;
}

const createCycleData = (cycleData) => {
    const cycle = new Placementcycle();

    cycle.placementCycleName = cycleData.placementCycleName;
    cycle.graduatingYear = cycleData.graduatingYear;
    cycle.startDate = cycleData.startDate;
    cycle.endDate = cycleData.endDate;
    cycle.acadYear = createAcadYear(cycleData.acadYear);
    cycle.specializations = cycleData.specializations.map((spec) => createCycleSpecRel(spec));

    return cycle;
}

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

export const createNewPlacementCycle = async (req: Request, res: Response, next: NextFunction) : Promise<Placementcycle | void> => {
    try {
        const placementCycle = await placementCycleService.create(createCycleData(req.body));

        res.status(201).json({ success: true, placementCycle })
    } catch (error) {
        return next(error);
    }
}