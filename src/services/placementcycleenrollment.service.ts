import { Placement_Cycle_Enrolment } from "../entity/Placement_Cycle_Enrolment";
import { Placement_Cycle_Enrollment_Repository } from "../repositories/placementcycleenrollment.repository";

export const enrollInPlacementCycle = async (enrollment: Placement_Cycle_Enrolment): Promise<Placement_Cycle_Enrolment | undefined> => {
    return await Placement_Cycle_Enrollment_Repository.save(enrollment);
}