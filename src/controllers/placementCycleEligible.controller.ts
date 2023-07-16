import { NextFunction, Request, Response } from "express";
import { addEligibleStudentInBulk, getEligbleStudents, checkEligibleToApply, removeEligibility } from "../services/placementcycleeligible.service";
import { UserRequest } from "../middleware/isAuthorized";

export const createEligibleStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eligible_students = req.body.eligible_students; // [{pcId,admno},{pcId,admno}...]
        const saved = await addEligibleStudentInBulk(eligible_students);
        res.status(200).send({ success: true, eligible_students: saved })
    } catch (error) {
        return next(error);
    }
}

export const fetchEligibleStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { pcId } = req.params;
        const eligible_students = await getEligbleStudents(parseInt(pcId));
        res.status(200).send({ success: true, eligible_students: eligible_students });
    } catch (error) {
        return next(error);
    }

}

export const checkEligibility = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        const admno = req.user.admno;
        const { pcId } = req.params;
        const eligible = await checkEligibleToApply(admno, parseInt(pcId));
        if (!eligible) return res.status(400).send({ success: false, eligible: false });
        res.status(200).send({ success: true, eligible: true });
    } catch (error) {
        return next(error);
    }
}

export const revokeEligibility = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { pcId, admno } = req.body;
        await removeEligibility(admno, parseInt(pcId));
        res.status(200).send({ success: true });
    } catch (error) {
        return next(error)
    }
}