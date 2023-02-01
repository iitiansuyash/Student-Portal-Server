import { env } from "../config";

interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    maxAge?: number;
}

export const STUDENT = 'student';
export const ADMIN = 'admin';

export const COOKIE_NAME = 'access_token';

export const CookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: env.app.host === 'localhost' ? false : 'none',
    secure: env.app.schema === 'https',
    maxAge: 60 * 24 * 60 * 60 * 1000,
};