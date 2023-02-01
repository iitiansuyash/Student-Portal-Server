import { NextFunction, Request, Response } from "express";
import { ADMIN } from "../constants";


export const isAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    const user = req['user'];
    
    if(!user || user.role!==ADMIN)
    return next('Not Authorized to access this route.');
    
    next();
}