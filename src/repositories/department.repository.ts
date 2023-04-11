import { AppDataSource } from '../data-source';
import { Department } from '../entity/Department';


export const Department_Repository = AppDataSource.getRepository(Department);