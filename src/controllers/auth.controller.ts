import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import * as authService from '../services/auth.service';
import * as jwt from 'jsonwebtoken';
import { CookieOptions, COOKIE_NAME } from "../constants";

interface SignInBody {
    email: string,
    password: string
}


export const SignIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } : SignInBody = req.body;

    try {
        const user : User | undefined = await authService.validateUser(email, password);

        console.log({user});
        if(!user)
        return next('Invalid Credentials.');

        const token = jwt.sign({ id: user.id, role: user.role?.id }, 'secret');

        res.cookie(COOKIE_NAME, token, CookieOptions);

        res.status(200).json({ success: true, token });
    } catch (error) {
        return next(error);
    }
}

// change password
// profile  