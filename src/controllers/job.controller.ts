import { NextFunction, Request, Response } from "express";
import { Notification_Form } from "../entity/Notification_Form";
import { NF_Repository } from "../repositories/job.repository";

export const fetchAllJobsForStudent = async (
  req: Request | any,
  res: Response,
  next: NextFunction
): Promise<Notification_Form | void> => {
  try {
    const jobsForEnrolledCycles = await NF_Repository.createQueryBuilder(
      "Notification_Form as NF"
    ).where(`Notification_Form.placementCycleId IN (
        select pce.placementCycleId
        from Placement_Cycle_Enrollment as pce
        where pce.admno = ${req?.user?.admno}
    )`);
    res.status(200).json({ success: true, jobs: jobsForEnrolledCycles });
  } catch (error) {
    return next(error);
  }
};
