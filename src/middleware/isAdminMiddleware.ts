import { NextFunction, Request, Response } from "express";
import { ADMIN } from "../constants";
import { UnauthorizedError } from "../utils/error/unauthorizedError";

export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = req['user'];
    const role = req['role'];

    if(!user || role!==ADMIN)
    throw new UnauthorizedError();

    next();
}