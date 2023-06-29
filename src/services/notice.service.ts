import { AppDataSource } from "../data-source";
import { Notices } from "../entity/Notices";

export const fetchNoticesForCycles = async (
  cycleIds
): Promise<Notices[] | null> => {
  return await await AppDataSource.query(`
    SELECT n.*, u.name as postedBy FROM Notices AS n
    LEFT JOIN user AS u
    ON u.id = n.userId
    WHERE n.placementCycleId IN (${cycleIds})
`);
};

export const create = async (notice: Notices) => {
  return await AppDataSource.getRepository(Notices).save(notice);
};

export const update = async (notice: Notices) => {
  return await AppDataSource.getRepository(Notices).save(notice);
};

export const remove = async (id: number) => {
  return await AppDataSource.getRepository(Notices).delete(id);
};

export const findById = async (id: number) => {
  return await AppDataSource.getRepository(Notices).findOneBy({ id });
};
