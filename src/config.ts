import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
    node: process.env.NODE_ENV || 'development',
    app: {
        host: process.env.APP_HOST,
        schema: process.env.APP_SCHEMA,
        port: process.env.PORT,
    },
    jwtSecret: process.env.JWT_SECRET,
    httponly: {
        adminReqOrigin: process.env.ADMIN_REQ_ORIGIN?.split(','),
    },
    api: {
        bodyParser: false
    },
    drive: {
        clientId: process.env.DRIVE_CLIENT_ID,
        clientSecret: process.env.DRIVE_CLIENT_SECRET,
        redirectURI: process.env.DRIVE_REDIRECT_URI,
        refreshToken: process.env.DRIVE_REFRESH_TOKEN
    },
}