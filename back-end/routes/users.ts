import express from "express";

const usersRouter = express.Router();

import passport from "passport";

// imports controllers
import {
  getUsers,
  getSingleUser,
  createUser,
  authUser,
  authUserGoogle,
  deleteUser,
} from "../controllers/usersController";
import { checkAuth } from "../middlewares/middlewares";

usersRouter.get("/:name", checkAuth, getSingleUser);
usersRouter.get("/", checkAuth, getUsers);
usersRouter.post("/create", createUser);
usersRouter.post("/auth", authUser);
usersRouter.post("/auth/google", authUserGoogle);
usersRouter.delete("/delete/:email", deleteUser);

export { usersRouter };
