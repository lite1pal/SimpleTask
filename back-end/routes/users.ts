import express from "express";

const usersRouter = express.Router();

// imported controllers
import {
  getUsers,
  getSingleUser,
  createUser,
  authUser,
  checkAuth,
  deleteUser,
} from "../controllers/usersController";

usersRouter.get("/:name", getSingleUser);
usersRouter.get("/", getUsers);
usersRouter.post("/create", createUser);
usersRouter.post("/auth", authUser);
usersRouter.get("/check", checkAuth);
usersRouter.delete("/delete/:name", deleteUser);

export { usersRouter };
