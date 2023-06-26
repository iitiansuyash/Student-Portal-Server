import { Placementcycle } from "../entity/Placementcycle";
import { Placementcycle_Repository } from "../repositories/placementcycle.repository";
import { fetchStudent } from "./student.service";
export const create = async (
  placementCycle: Placementcycle
): Promise<Placementcycle | undefined> => {
  return await Placementcycle_Repository.save(placementCycle);
};

export const findAll = async (): Promise<Placementcycle[] | undefined> => {
  return await Placementcycle_Repository.find();
};

export const findById = async (placementCycleId: number): Promise<Placementcycle | undefined> => {
  return await Placementcycle_Repository.findOne({ where: { placementCycleId } });
}

export const update = async (placementCycleId: number, updatedCycleDetails: Placementcycle) => {
  return await Placementcycle_Repository.update({ placementCycleId }, updatedCycleDetails);
}

export const checkPlacementCycleEligibility = async (admno: string, placementCycleId: number) => {
  let placemnetCycleGraduatingYear = (await findById(placementCycleId)).graduatingYear;
  let studentGraduatingYear = (await fetchStudent(admno)).graduatingYear;
  return placemnetCycleGraduatingYear === studentGraduatingYear;
}