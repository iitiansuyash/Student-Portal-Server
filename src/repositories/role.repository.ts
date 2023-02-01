import { AppDataSource } from "../data-source";
import { Role } from "../entity/Role";

export const roleRepository = AppDataSource.getRepository(Role);