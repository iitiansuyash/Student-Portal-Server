import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { COOKIE_NAME } from "../constants";
import { fetchUser } from "../services/user.service";


export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies?.[`${COOKIE_NAME}`];

    if(req.headers.authorization)
    {
        token = token || req.headers.authorization.split(' ')[0];
    }

    if(!token)
        return next('Not Authorized to access this route');

    try {
        const decoded = jwt.verify(token, 'secret');

        const user = await fetchUser(decoded?.id);

        if(!user)
        return next('No user found with this id');

        req['user'] = user;
        next();
    } catch (error) {
        return next(error);
    }
}