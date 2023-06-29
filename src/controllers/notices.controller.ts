import { NextFunction, Request, Response } from "express";
import { Notices } from "../entity/Notices";
import { AppDataSource } from "../data-source";
import { UserRequest } from "../middleware/isAuthorized";
import { NotFoundError } from "../utils/error/notFoundError";
import * as placementCycleService from "../services/placementcycle.service";

export const fetchNoticesForCycles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Notices[] | void> => {
  try {
    const cycleIds = req.body?.cycleIds;

    const notices =
      cycleIds && cycleIds.length > 0
        ? await AppDataSource.query(`
            SELECT n.*, u.name as postedBy FROM Notices AS n
            LEFT JOIN user AS u
            ON u.id = n.userId
            WHERE n.placementCycleId IN (${cycleIds})
        `)
        : [];

    res.status(201).json({ success: true, notices });
  } catch (error) {
    return next(error);
  }
};

export const createNotice = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Notices | void> => {
  try {
    const user = req.user;
    const { placementCycleId } = req.params;

    const placementCycle = await placementCycleService.findById(
      parseInt(placementCycleId)
    );

    if (!placementCycle) throw new NotFoundError();

    const notice = await AppDataSource.getRepository(Notices).save({ ...req.body, placementCycle, user });

    notice.placementCycleId = notice.placementCycle?.placementCycleId;
    notice.placementCycle = undefined;
    notice.userId = notice.user?.id;
    notice.user = undefined;

    res.status(201).json({ succes: true, notice });
  } catch (error) {
    return next(error);
  }
};
