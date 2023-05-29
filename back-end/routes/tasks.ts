import express, { Request, Response, NextFunction } from "express";
const tasksRouter = express();

import {
  getTasks,
  createTask,
  deleteTask,
} from "../controllers/tasksController";
import { checkAuth } from "../controllers/usersController";

// const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
//   console.log(req);
//   next();
// };

tasksRouter.get("/:user_id", checkAuth, getTasks);
tasksRouter.post("/create", createTask);
tasksRouter.delete("/delete/:_id", deleteTask);

export { tasksRouter };
