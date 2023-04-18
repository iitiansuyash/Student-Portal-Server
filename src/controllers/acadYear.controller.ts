import { NextFunction, Request, Response } from "express";
import { Academic_Year } from "../entity/Academic_Year";
import { AppDataSource } from "../data-source";
import { NotFoundError } from "../utils/error/notFoundError";

const createAcadYearData = (year: string) => {
  const acadYear = new Academic_Year();

  acadYear.year = year;

  return acadYear;
};

export const fetchCurrentAcadYear = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Academic_Year | void> => {
  try {
    const acadYear = await AppDataSource.query(`
            SELECT * FROM academic_year WHERE isCurrent = 1
        `);

    res.status(201).json({ success: true, acadYear: acadYear[0] });
  } catch (error) {
    return next(error);
  }
};

export const fetchAllAcadYears = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Academic_Year[] | void> => {
  try {
    const acadYears = await AppDataSource.query(`SELECT * FROM academic_year`);

    res.status(201).json({ success: true, acadYears });
  } catch (error) {
    return next(error);
  }
};

export const createAcademicYear = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Academic_Year | void> => {
  try {
    const { year } = req.body;
    const acadYear = await AppDataSource.getRepository(Academic_Year).save(
      createAcadYearData(year)
    );

    res.status(201).json({ success: true, acadYear });
  } catch (error) {
    return next(error);
  }
};

export const changeAcadYearStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Academic_Year | void> => {
  try {
    const { year } = req.params;

    const acadYear = await AppDataSource.getRepository(Academic_Year).findOne({
      where: { year },
    });

    if (!acadYear) throw new NotFoundError();

    if (acadYear.isCurrent)
      res
        .status(400)
        .json({
          success: false,
          message: "At least one Academic Year must be marked as current",
        });

    const currAcadYear = await AppDataSource.query(`
        SELECT * FROM academic_year WHERE isCurrent = 1
        `);

    acadYear.isCurrent = 1;
    currAcadYear.isCurrent = 0;

    await AppDataSource.query(
      `UPDATE Academic_Year SET year="${acadYear.year}", isCurrent=1 WHERE year = "${year}"`
    );
    await AppDataSource.query(
      `UPDATE Academic_Year SET year="${currAcadYear[0].year}", isCurrent=0 WHERE year = "${currAcadYear[0].year}"`
    );

    res
      .status(201)
      .json({
        success: true,
        message: `Status of the selected year successfully changed`,
      });
  } catch (error) {
    return next(error);
  }
};
