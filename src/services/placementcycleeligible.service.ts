import { Placement_Cycle_Eligible } from "../entity/Placement_Cycle_Eligible";
import { Placement_Cycle_Eligible_Repository } from "../repositories/placementcycleeligible.repository"


export const getEligbleStudents = async (pcId: number) => {
    return await Placement_Cycle_Eligible_Repository.find({
        where: {
            placementCycleId: pcId
        }
    });
}

export const checkEligibleToApply = async (admno: string, pcId: number) => {
    return await Placement_Cycle_Eligible_Repository.findOne({
        where: {
            admno: admno,
            placementCycleId: pcId
        }
    })
}

export const addEligibleStudentInBulk = async (eligible_students) => {
    const cycleEligibleStudent: Placement_Cycle_Eligible[] = [];
    for (let i = 0; i < eligible_students.length; i++) {
        const student = new Placement_Cycle_Eligible();
        student.placementCycleId = eligible_students[i].pcId;
        student.admno = eligible_students[i].admno;
        cycleEligibleStudent.push(student);
    }
    console.log(cycleEligibleStudent);
    return await Placement_Cycle_Eligible_Repository.save(cycleEligibleStudent);
}

export const removeEligibility = async (admno: string, pcId: number) => {
    return await Placement_Cycle_Eligible_Repository.delete({ admno: admno, placementCycleId: pcId });
}