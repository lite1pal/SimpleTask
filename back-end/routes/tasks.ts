import express from "express";
const tasksRouter = express();

import {
  getTasks,
  createTask,
  deleteTask,
} from "../controllers/tasksController";
import { checkAuth } from "../middlewares/middlewares";

tasksRouter.get("/:user_id", checkAuth, getTasks);
tasksRouter.post("/create", checkAuth, createTask);
tasksRouter.delete("/delete/:_id", checkAuth, deleteTask);

export { tasksRouter };
