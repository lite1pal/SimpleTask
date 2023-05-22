"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
// connection to MongoDB
const db_1 = require("./database/db");
// imported routers
const users_1 = require("./routes/users");
app.use("/users", users_1.usersRouter);
(0, db_1.connectToDatabase)();
