import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { ADMIN, COOKIE_NAME } from "../constants";
import { Student } from "../entity/Student";
import { fetchStudent } from "../services/student.service";
import { fetchUser } from "../services/user.service";
import { UnauthorizedError } from "../utils/error/unauthorizedError";
import { NotFoundError } from "../utils/error/notFoundError";
import { env } from "../config";

export interface UserRequest extends Request{
    user: Student
}

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies?.[`${COOKIE_NAME}`];

    if(req.headers.authorization)
    {
        token = token || req.headers.authorization.split(' ')[1];
    }

    if(!token)
    throw new UnauthorizedError();

    try {
        const decoded = jwt.verify(token, env.jwtSecret);

        const user = decoded?.role === ADMIN ? await fetchUser(decoded?.id) : await fetchStudent(decoded?.id);

        if(!user)
        throw new NotFoundError();

        req['user'] = user;
        req['role'] = decoded.role;
        next();
    } catch (error) {
        next(error);
    }
}