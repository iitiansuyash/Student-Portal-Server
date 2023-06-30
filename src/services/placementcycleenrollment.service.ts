import { Placement_Cycle_Enrolment } from "../entity/Placement_Cycle_Enrolment";
import { Placement_Cycle_Enrollment_Repository } from "../repositories/placementcycleenrollment.repository";
import { AppDataSource } from "../data-source";

export const enrollInPlacementCycle = async (enrollment: Placement_Cycle_Enrolment): Promise<Placement_Cycle_Enrolment | undefined> => {
    return await Placement_Cycle_Enrollment_Repository.save(enrollment);
}

export const enrolledPlacementCycles = async (admno: string) => {
    return await AppDataSource.query(`
            SELECT * FROM placementcycle AS pc
            WHERE pc.placementCycleId IN (
                SELECT DISTINCT pce.placementCycleId
                FROM placement_cycle_enrolment as pce
                WHERE pce.admno = '${admno}'
            )
        `);
}