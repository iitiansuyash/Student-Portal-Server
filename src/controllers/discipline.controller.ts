import { NextFunction, Request, Response } from "express";
import { Discipline } from "../entity/Discipline";
import { AppDataSource } from "../data-source";

const disciplineData = (data) => {
    const discipline = new Discipline();

    discipline.disciplineName = data.disciplineName;
    discipline.course = data.course;
    discipline.dept = data.dept;

    return discipline;
}

export const fetchAllDisciplines = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Discipline[] | void> => {
  try {
    const disciplines = await AppDataSource.getRepository(Discipline)
      .createQueryBuilder("Discipline")
      .leftJoinAndSelect("Discipline.dept", "Department")
      .leftJoinAndSelect("Discipline.course", "Course")
      .getMany();

    res.status(201).json({ success: true, disciplines });
  } catch (error) {
    return next(error);
  }
};

export const createDiscipline = async (req: Request, res: Response, next: NextFunction) : Promise<Discipline | void> => {
    try {
        const discipline = await AppDataSource.getRepository(Discipline).save(disciplineData(req.body));

        res.status(201).json({ success: true, discipline });
    } catch (error) {
        return next(error);
    }
}
