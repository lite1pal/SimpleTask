"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const usersRouter = express_1.default.Router();
exports.usersRouter = usersRouter;
// imported controllers
const usersController_1 = require("../controllers/usersController");
usersRouter.get("/:name", usersController_1.getSingleUser);
usersRouter.get("/", usersController_1.getUsers);
usersRouter.post("/create", usersController_1.createUser);
usersRouter.post("/auth", usersController_1.authUser);
usersRouter.get("/check", usersController_1.checkAuth);
usersRouter.delete("/delete/:name", usersController_1.deleteUser);
