"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const usersRouter = express_1.default.Router();
exports.usersRouter = usersRouter;
// imports controllers
const usersController_1 = require("../controllers/usersController");
const middlewares_1 = require("../middlewares/middlewares");
usersRouter.get("/:name", middlewares_1.checkAuth, usersController_1.getSingleUser);
usersRouter.get("/", middlewares_1.checkAuth, usersController_1.getUsers);
usersRouter.post("/create", usersController_1.createUser);
usersRouter.post("/auth", usersController_1.authUser);
usersRouter.post("/auth/google", usersController_1.authUserGoogle);
usersRouter.delete("/delete/:email", usersController_1.deleteUser);
