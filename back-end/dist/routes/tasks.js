"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksRouter = void 0;
const express_1 = __importDefault(require("express"));
const tasksRouter = (0, express_1.default)();
exports.tasksRouter = tasksRouter;
const tasksController_1 = require("../controllers/tasksController");
const middlewares_1 = require("../middlewares/middlewares");
tasksRouter.get("/:user_id", middlewares_1.checkAuth, tasksController_1.getTasks);
tasksRouter.post("/create", middlewares_1.checkAuth, tasksController_1.createTask);
tasksRouter.delete("/delete/:_id", middlewares_1.checkAuth, tasksController_1.deleteTask);
