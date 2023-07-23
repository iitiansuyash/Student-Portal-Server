import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import * as userService from '../services/user.service';
import { AppDataSource } from "../data-source";

const createUserData = (data: User) => {
    const user = new User();

    user.name = data.name;
    user.username = data.username;
    user.phone = data.phone;
    user.email = data.email;
    user.password = data.password;
    user.permissions = data?.permissions || 0;

    return user;
}

export const createUser = async (req: Request, res: Response, next: NextFunction) : Promise<User | void> => {
    try {
        const user = await userService.create(createUserData(req.body));

        res.status(201).json({ success: true, user });
    } catch (error) {
        return next(error);
    }
}

export const createBulk = async (req: Request, res: Response, next: NextFunction): Promise<User[] | void> => {

    try {
        for(const user in req.body)
            await userService.create(createUserData(req.body[user]));

        res.status(200).json({ success: true, message: 'Users added successfully' });
    } catch (error) {
        return next(error);
    }
}

export const fetchUsers = async (req: Request, res: Response, next: NextFunction) : Promise<User | void> => {
    try {

        const users = await AppDataSource.query(`
            SELECT *
            FROM user
            WHERE deletedAt IS NULL`)

        res.status(201).json({ success: true, users });
    } catch (error) {
        return next(error);
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) : Promise<User | void> => {
    const { userId } = req.params;

    try {
        const student = await userService.remove(parseInt(userId));

        res.status(200).json({ success: true, student });
    } catch (error) {
        return next(error);
    }
}