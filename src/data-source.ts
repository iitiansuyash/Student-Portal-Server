import "reflect-metadata"
import { DataSource } from "typeorm"
import { env } from './config';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: env.db.host,
    port: parseInt(env.db.port as string, 10),
    username: env.db.username,
    password: env.db.password,
    database: env.db.name,
    synchronize: true,
    logging: env.node === 'development'? true : false,
    entities: [__dirname + '/entity/**/*.{js,ts}'],
    migrations: [__dirname + '/migration/**/*.{js,ts}'],
    subscribers: [],
    connectTimeout: 30000,
})

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error));
