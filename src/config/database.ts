import { DataSource } from "typeorm";

// Check NODE_ENV for the .env type, and set sychronize to false if production
const synchronizeStatus = () => {
    if (process.env.NODE_ENV == 'production') {
        return false
    } else {
        return true
    }
}

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        '../entities/*.ts'
    ],
    synchronize: synchronizeStatus(),
    logging: true
})