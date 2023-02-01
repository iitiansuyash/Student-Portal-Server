import { User } from "../entity/User";
import { userRepository } from "../repositories/user.repository";
import * as userService from "./user.service";

export const validateUser = async (email: string, password: string): Promise<User> => {
    const user = await userRepository.findOne({
        where: {
            email,
            isRegistered: 1,
        },
    });

    console.log(user);
    
    if (user) {
        if (await User.comparePassword(user, password)) {
            return await userService.fetchUser(user.id);
        }
    }
    return undefined;
}