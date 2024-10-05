"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV == 'production') {
    require('dotenv').config({ path: '.env.production' });
}
else {
    require('dotenv').config({ path: '.env.development' });
}
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
// import { AppDataSource } from './config/database';
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
database_1.AppDataSource.initialize()
    .then(() => {
    console.log(`DB connection established`);
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
})
    .catch((error) => console.log(`DB connection error:`, error));
