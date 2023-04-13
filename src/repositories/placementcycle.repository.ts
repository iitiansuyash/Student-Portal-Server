import { AppDataSource } from '../data-source';
import { Placementcycle } from '../entity/Placementcycle';


export const Placementcycle_Repository = AppDataSource.getRepository(Placementcycle);