import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";

export const Company_Repository = AppDataSource.getRepository(Company);