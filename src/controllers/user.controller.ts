import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';
import { STUDENT } from '../constants/index';
import * as userService from '../services/user.service';
import * as roleService from '../services/role.service';

interface CreateUserBody {
    name: string,
    email: string,
    admNo: string
}

const createNewUserData = async (userData: CreateUserBody) : Promise<User> => {
    const user = new User();
    user.email = userData.email;
    user.password = `IITISM@${userData.admNo.toUpperCase()}`;
    user.role = await roleService.findByQuery({ name: STUDENT });
    user.isBlocked = 0;
    user.isConfirmed = 0;
    user.isRegistered = 1;
    return user;
}

export const findUserById = async (req: Request, res: Response, next: NextFunction) : Promise<User | any> => {
    const userId = req.params?.userId;

    try {
        const user = await userService.fetchUser(userId);

        if(!user)
        return next('User not found');
        
        res.status(200).json({ success: true, user });
    } catch (error) {
        return next(error);
    }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) : Promise<User | any> => {
    const userData: CreateUserBody = req.body;

    try {
        const user = await userService.create(await createNewUserData(userData));

        res.status(200).json({ success: true, user });
    } catch (error) {
        return next(error);
    }
}

export const fetchAllUsers = async (req: Request, res: Response, next: NextFunction) : Promise<User | any> => {
    try {
        const users = await userService.findAll();

        res.status(200).json({ success: true, users });
    } catch (error) {
        return next(error);
    }
}

export const createBulk = async (req: Request, res: Response, next: NextFunction) : Promise<User[] | any> => {
    let users = req.body;

    try {
        users = users.map(async (user: CreateUserBody) => await userService.create(await createNewUserData(user)));

        res.status(200).json({ success: true, message: 'Users added successfully' });
    } catch (error) {
        return next(error);
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) : Promise<User | any> => {
    let userId = req.params.userId;

    try {
        const user = await userService.remove(userId);

        res.status(200).json({ success: true, user });
    } catch (error) {
        return next(error);
    }
}
