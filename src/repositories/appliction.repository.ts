import { AppDataSource } from "../data-source";
import { NF_Applications } from "../entity/NF_Applications";

export const NF_Applications_Repository = AppDataSource.getRepository(NF_Applications);