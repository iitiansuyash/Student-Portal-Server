import { NextFunction, Request, Response } from "express";
import { Notices } from "../entity/Notices";
import { UserRequest } from "../middleware/isAuthorized";
import { NotFoundError } from "../utils/error/notFoundError";
import * as placementCycleService from "../services/placementcycle.service";
import * as noticeService from "../services/notice.service";

interface UpdatedNotice {
  title: string;
  description: string;
  placementCycleId: number;
}

export const fetchNoticesForCycles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Notices[] | void> => {
  try {
    const cycleIds = req.body?.cycleIds;

    const notices =
      cycleIds && cycleIds.length > 0
        ? await noticeService.fetchNoticesForCycles(cycleIds)
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

    await noticeService.create({
      ...req.body,
      placementCycle,
      user,
    });

    res
      .status(201)
      .json({ succes: true, message: "Notice created successfully!!" });
  } catch (error) {
    return next(error);
  }
};

export const updateNotice = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Notices | void> => {
  try {
    const user = req.user;
    const noticeId = req.params.noticeId;
    const { title, description, placementCycleId }: UpdatedNotice = req.body;

    const notice = await noticeService.findById(parseInt(noticeId, 10));

    if (!notice) throw new NotFoundError();

    const placementCycle = await placementCycleService.findById(
      placementCycleId
    );

    if (!placementCycle) throw new NotFoundError();

    await noticeService.update({
      ...notice,
      title,
      description,
      placementCycle,
      user,
    });

    res
      .status(201)
      .json({ succes: true, message: "Notice updated successfully!!" });
  } catch (error) {
    return next(error);
  }
};

export const deleteNotice = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const noticeId = req.params.noticeId;

    const notice = await noticeService.findById(parseInt(noticeId, 10));

    if (!notice) throw new NotFoundError();

    await noticeService.remove(parseInt(noticeId, 10));

    return res.status(201).json({ succes: true, message: 'Notice deleted Successfully!!' });
  } catch (error) {
    return next(error);
  }
};
