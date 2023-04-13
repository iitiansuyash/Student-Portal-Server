import { Placementcycle } from '../entity/Placementcycle';
import { Placementcycle_Repository } from '../repositories/placementcycle.repository';


export const create = async (placementCycle: Placementcycle) : Promise<Placementcycle | undefined> => {
    return await Placementcycle_Repository.save(placementCycle);
}