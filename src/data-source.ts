import "reflect-metadata"
import { DataSource } from "typeorm"
import { env } from './config';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: env.db.host,
    port: parseInt(env.db.port),
    username: env.db.username,
    password: env.db.password,
    database: env.db.name,
    synchronize: true,
    logging: true,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: [],
})

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error));