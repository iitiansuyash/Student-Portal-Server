import { NextFunction, Request, Response } from "express";
import { ADMIN } from "../constants";
import { UnauthorizedError } from "../utils/error/unauthorizedError";


export const isAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = req['user'];

    if(!user || user.role!==ADMIN)
    throw new UnauthorizedError();

    next();
}