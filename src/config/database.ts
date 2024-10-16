require('dotenv').config();
import { DataSource } from "typeorm";
import { User, Quiz, QuizEvent, UserQuizAttempt, UserQuizAttemptEvent, Event } from "../entities";

// Check NODE_ENV for the .env type, and set synchronize to false if production
const synchronizeStatus = () => {
    return process.env.NODE_ENV !== 'production'; // Use true in dev, false in production
}

// export const AppDataSource = new DataSource({
//     type: 'mysql',
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     entities: [
//         User,
//         Quiz,
//         QuizEvent,
//         UserQuizAttempt,
//         UserQuizAttemptEvent,
//         Event
//     ],
//     synchronize: synchronizeStatus(),
//     logging: true
// });

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Auska_Dornos_02',
    database: 'timeSnapDB',
    entities: [
        User,
        Quiz,
        QuizEvent,
        UserQuizAttempt,
        UserQuizAttemptEvent,
        Event
    ],
    synchronize: true,
    dropSchema: true,
    logging: true
})