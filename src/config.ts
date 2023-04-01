import { AppDataSource } from "./data-source";


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
    }
}