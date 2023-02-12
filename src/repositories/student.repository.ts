import { AppDataSource } from "../data-source";
import { Student } from "../entity/Student";

export const studentRepository = AppDataSource.getRepository(Student);