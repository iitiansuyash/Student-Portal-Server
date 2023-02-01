import { User } from "../entity/User";
import { userRepository } from "../repositories/user.repository"

interface Query {
    id?: string;
    name?: string;
    email?: string
}

export const findAll = async () : Promise<User[] | undefined> => {
    return await userRepository.find();
}

export const findByQuery = async (query: Query) : Promise<User | undefined> => {
    return await userRepository.findOne({ where: query });
}

export const fetchUser = async (id: string): Promise<User | undefined> => {
    return await userRepository.findOneBy({ id });
}

export const create = async (user: User): Promise<User> => {
    return await userRepository.save(user);
}

export const update = async (id: string, user: User): Promise<User> => {
    let updatedUser = { ...user, updatedAt: new Date() };
    await userRepository.update({ id }, updatedUser);
    return await fetchUser(id);
}

export const remove = async (id: string): Promise<User | undefined> => {
    let user = await userRepository.findOneBy({ id });

    if(user)
    await userRepository.softDelete(id);

    return user;
}
