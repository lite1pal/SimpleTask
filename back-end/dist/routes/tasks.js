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
const usersController_1 = require("../controllers/usersController");
// const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
//   console.log(req);
//   next();
// };
tasksRouter.get("/:user_id", usersController_1.checkAuth, tasksController_1.getTasks);
tasksRouter.post("/create", tasksController_1.createTask);
tasksRouter.delete("/delete/:_id", tasksController_1.deleteTask);
