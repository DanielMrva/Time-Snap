if (process.env.NODE_ENV == 'production') {
    require('dotenv').config({ path: '.env.production' });
} else {
    require('dotenv').config({ path: '.env.development' });
}

import 'reflect-metadata';
import express, { Application } from 'express';
import { AppDataSource } from './config/database';
import cron from 'node-cron'
import { fetchAndStoreEvents } from './services/eventService';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log(`DB connection established`);
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`)
        })
    })
    .catch((error) => console.log(`DB connection error:`, error));

cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled task to fetch events and generate quiz...');
    await fetchAndStoreEvents();
  });



