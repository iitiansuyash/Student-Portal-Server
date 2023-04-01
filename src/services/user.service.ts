import { User } from "../entity/User";
import { UserRepository } from "../repositories/usser.repository";

interface Query {
    id?: number;
    email?: string
}

export const findAll = async () : Promise<User[] | undefined> => {
    return await UserRepository.find();
}

export const findByQuery = async (query: Query) : Promise<User | undefined> => {
    return await UserRepository.findOne({ where: query });
}

export const fetchUser = async (id: number): Promise<User | undefined> => {
    return await UserRepository.findOneBy({ id });
}

export const create = async (user: User): Promise<User> => {
    return await UserRepository.save(user);
}

export const update = async (id: number, user: User): Promise<User> => {
    const updatedUser = { ...user, updatedAt: new Date() };
    await UserRepository.update({ id }, updatedUser);
    return await fetchUser(id);
}

export const remove = async (id: number): Promise<User | undefined> => {
    const user = await UserRepository.findOneBy({ id });

    if(user)
    await UserRepository.softDelete(id);

    return user;
}
