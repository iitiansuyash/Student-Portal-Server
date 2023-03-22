import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import * as jwt from "jsonwebtoken";
import { CookieOptions, COOKIE_NAME } from "../constants";
import { Student } from "../entity/Student";
import { studentRepository } from "../repositories/student.repository";
import { AppDataSource } from "../data-source";

interface SignInBody {
  username: string;
  password: string;
}

// Initial Sign-In for Students
export const SignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Student | void> => {
  const { username, password }: SignInBody = req.body;

  try {
    // MIS Login for students (currently a dummy check is implemented - Has to replaced with original check API)
    const student: Student | undefined = await authService.validateStudent(
      username,
      password
    );

    // If student not found return with an error response
    if (!student) return next("Invalid Credentials.");

    // Prepare Student Data
    const studentData = await studentRepository
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.cvs", "student_cvs")
      .leftJoinAndSelect("student.placementcycles", "placementcycle")
      .leftJoinAndSelect("student.specializations", "specialization")
      .where("student.admno = :username", { username })
      .getOne();

    /*
    * Generate a JWT token for authentication purpose
    ! JWT SECRET has to be hidden
    */
    const token = jwt.sign({ id: student.admno }, "secret");

    // attack cookie to the response
    res.cookie(COOKIE_NAME, token, CookieOptions);

    res.status(200).json({ success: true, studentData, token });
  } catch (error) {
    return next(error);
  }
};


export const updateDB = async (req: Request, res: Response, next: NextFunction)=> {
  try {
    const Specs = await AppDataSource.getRepository('Specialization').createQueryBuilder('Specialization').select('*').execute();

    const SpecsRel = await AppDataSource.getRepository('Specialization_Discipline_Rel').createQueryBuilder('Specialization_Discipline_Rel').leftJoinAndSelect('Specialization_Discipline_Rel.specId', 'Specialization').where('Specialization_Discipline_Rel.specId = Specialization.specId').getMany();

    for(const i in Specs)
    {
      const rel = SpecsRel.filter(item => item.placementCycleId === Specs[i].placementCycleId);
      // Specs[i].acad_year = rel[0]?.acad_year?.year;
      console.log(rel);
      // await AppDataSource.getRepository('Specialization').createQueryBuilder('Specialization').update(Specialization).set({ discipline: rel[0]?.course?.courseId }).where("disciplineId=:specId", { specId: Specs[i].disciplineId }).execute();
    }

    // console.log({ Specs, SpecsRel });

    res.status(200).json({ success: true,SpecsRel, Specs });
  } catch (error) {
    return next(error);
  }
}

