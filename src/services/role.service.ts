import { Role } from "../entity/Role";
import { roleRepository } from "../repositories/role.repository";


interface Query {
    id?: string;
    name?: string;
}

export const create = async (role: Role) : Promise<Role | undefined> => {
    return await roleRepository.save(role);
}

export const findByQuery = async (query: Query) : Promise<Role | undefined> => {
    return await roleRepository.findOne({ where: query });
}