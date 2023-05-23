import express from "express";

const usersRouter = express.Router();

// imported controllers
import {
  getUsers,
  getSingleUser,
  createUser,
  authUser,
  checkAuth,
} from "../controllers/usersController";

usersRouter.get("/", getUsers);
usersRouter.get("/:name", getSingleUser);
usersRouter.post("/create", createUser);
usersRouter.post("/auth", authUser);
usersRouter.get("/check", checkAuth);

export { usersRouter };
