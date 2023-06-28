import { AppDataSource } from '../data-source';
import { Placement_Cycle_Enrolment } from '../entity/Placement_Cycle_Enrolment';


export const Placement_Cycle_Enrollment_Repository = AppDataSource.getRepository(Placement_Cycle_Enrolment);