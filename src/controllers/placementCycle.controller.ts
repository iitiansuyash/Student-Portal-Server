import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Placementcycle } from "../entity/Placementcycle";
import { UserRequest } from "../middleware/isAuthorized";
import * as placementCycleService from "../services/placementcycle.service";
import { Specialization_Placementcycle_rel } from "../entity/Specialization_placementcycle_rel";
import { Academic_Year } from "../entity/Academic_Year";
import { Placementcycle_Repository } from "../repositories/placementcycle.repository";
import { NotFoundError } from "../utils/error/notFoundError";
import { logger } from '../utils/logger';
import { checkPlacementCycleEligibility } from "../services/placementcycle.service";
import { enrollInPlacementCycle } from "../services/placementcycleenrollment.service";
import { Placement_Cycle_Enrolment } from "../entity/Placement_Cycle_Enrolment";

const createCycleSpecRel = (spec) => {
  const specRel = new Specialization_Placementcycle_rel();

  specRel.specialization = spec;

  return specRel;
};

const createAcadYear = (yearData) => {
  const acadYear = new Academic_Year();

  acadYear.year = yearData.year;
  acadYear.isCurrent = yearData.isCurrent;

  return acadYear;
};

const createCycleData = (cycleData) => {
  const cycle = new Placementcycle();

  cycle.placementCycleId = cycleData?.placementCycleId;
  cycle.placementCycleName = cycleData.placementCycleName;
  cycle.graduatingYear = cycleData.graduatingYear;
  cycle.startDate = cycleData.startDate;
  cycle.endDate = cycleData.endDate;
  cycle.acadYear = createAcadYear(cycleData.acadYear);
  cycle.specializations = cycleData?.specializations?.map((spec) =>
    createCycleSpecRel(spec)
  );
  cycle.type = cycleData.type;

  return cycle;
};

export const fetchAllPlacementCycles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Placementcycle | void> => {
  try {
    const cycles = await Placementcycle_Repository.createQueryBuilder(
      "Placementcycle"
    )
      .leftJoinAndSelect("Placementcycle.acadYear", "Academic_Year")
      .leftJoinAndSelect("Placementcycle.graduatingYear", "Graduation_Year")
      .getMany();

    res.status(201).json({ success: true, cycles });
  } catch (error) {
    return next(error);
  }
};

export const fetchEnrolledPlacementCycle = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Placementcycle | void> => {
  try {
    const admno = req?.user?.admno;

    const cycles = await AppDataSource.query(`
            SELECT * FROM placementcycle AS pc
            WHERE pc.placementCycleId IN (
                SELECT DISTINCT pce.placementCycleId
                FROM placement_cycle_enrolment as pce
                WHERE pce.admno = '${admno}'
            )
        `);

    res.status(201).json({ success: true, cycles });
  } catch (error) {
    return next(error);
  }
};

export const createNewPlacementCycle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Placementcycle | void> => {
  try {
    const placementCycle = await placementCycleService.create(
      createCycleData(req.body)
    );

    res.status(201).json({ success: true, placementCycle });
  } catch (error) {
    return next(error);
  }
};

export const fetchPlacementCycleById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Placementcycle | void> => {
  try {
    const { placementCycleId } = req.params;

    const placementCycle = await placementCycleService.findById(
      parseInt(placementCycleId)
    );

    if (!placementCycle) throw new NotFoundError();

    const specializations = await AppDataSource.query(`
      SELECT s.specId, s.specName, disp.disciplineId, disp.disciplineName, dept.deptId, dept.deptName, c.courseId, c.courseName
      FROM Specialization_placementcycle_rel AS spr
      LEFT JOIN Specialization AS s
        ON s.specId = spr.specId
      LEFT JOIN Discipline AS disp
        ON disp.disciplineId = s.disciplineId
      LEFT JOIN Department AS dept
        ON dept.deptId = disp.departmentId
      LEFT JOIN Course AS c
        ON c.courseId = disp.courseId
      WHERE spr.placementCycleId = ${placementCycleId}
    `);

    res.status(201).json({
      success: true,
      placementCycle: { ...placementCycle, graduatingYear: placementCycle.graduatingYear.year },
      specializations
    });
  } catch (error) {
    return next(error);
  }
};

export const updatePlacementCycle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { placementCycleId } = req.params;
    const cycleDetails = req.body;

    const placementCycle = await placementCycleService.findById(
      parseInt(placementCycleId)
    );

    if (!placementCycle) throw new NotFoundError();

    const updatedCycleDetails = {
      ...placementCycle,
      ...createCycleData(cycleDetails),
    };

    await placementCycleService.update(
      parseInt(placementCycleId),
      updatedCycleDetails
    );

    res.status(201).json({
      success: true,
      message: "Placementcycle updated successfully !!",
    });
  } catch (error) {
    return next(error);
  }
};

export const updateSpecializationForCycle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Placementcycle | void> => {
  try {
    const { placementCycleId } = req.params;
    const specializationIds = req.body;

    logger.info('Fetch Placement Cycle By Id');
    const placementCycle = await placementCycleService.findById(
      parseInt(placementCycleId)
    );

    if (!placementCycle) throw new NotFoundError();

    logger.info('Get Specializations Ids to be removed');
    const specToRemove: number[] = (await AppDataSource.query(`
      SELECT DISTINCT spr.specId
      FROM Specialization_placementcycle_rel AS spr
      WHERE (spr.specId NOT IN (${specializationIds})) AND (spr.placementCycleId = ${parseInt(placementCycleId)})
    `)).map((spec: { specId: number }) => spec.specId);


    logger.info('Remove the specializations for that cycle');
    if (specToRemove && specToRemove.length > 0)
      await AppDataSource.getRepository(Specialization_Placementcycle_rel).createQueryBuilder(
        "Specialization_placementcycle_rel"
      )
        .delete()
        .where(
          `specId IN (${specToRemove}) AND placementCycleId = ${parseInt(placementCycleId)}`
        ).execute();

    const specToInsert = specializationIds.map((id) => ({
      specId: id,
      placementCycleId,
    }));

    logger.info('Insert new Specialization Ids List');
    if (specToInsert && specToInsert.length > 0)
      await AppDataSource.getRepository(Specialization_Placementcycle_rel).upsert(
        specToInsert,
        {
          conflictPaths: ["placementCycleId", "specId"],
          skipUpdateIfNoValuesChanged: true,
        }
      );

    res
      .status(201)
      .json({ success: true, message: "Data successfully updated !!", placementCycleId: parseInt(placementCycleId) });
  } catch (error) {
    return next(error);
  }
};

export const enrollStudent = async (
  req: Request,
  res: Response,
) => {
  const { placementCycleId } = req.params;
  const { admno } = req.body;
  const eligible = await checkPlacementCycleEligibility(admno, Number(placementCycleId))
  if (!eligible)
    return res.status(400).json({
      success: false, message: "Student is not eligible"
    })
  const enrollment = new Placement_Cycle_Enrolment();
  enrollment.admno = admno
  enrollment.placementCycleId = Number(placementCycleId);
  await enrollInPlacementCycle(enrollment);
  return res.status(200).json({ success: true, message: "Enrolled Sucessfully" });
}