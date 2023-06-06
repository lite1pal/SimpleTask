"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const tasksModel_1 = __importDefault(require("../models/tasksModel"));
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const tasks = yield tasksModel_1.default.find({ user: user_id });
        return res.status(200).json({ message: "Tasks are retrieved.", tasks });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Error occured while retrieving users");
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, deadline, user_id } = req.body;
        console.log(deadline);
        if (!title || !user_id)
            return res.status(400).json("Some of req.body values is missing");
        let newTask;
        if (!deadline) {
            newTask = yield tasksModel_1.default.create({ title, user: user_id });
        }
        else {
            newTask = yield tasksModel_1.default.create({ title, deadline, user: user_id });
        }
        console.log(newTask);
        return res.status(200).json({ message: "Task is created.", newTask });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Error occured while creating a task");
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, deadline } = req.body;
        let updatedTask;
        if (title && deadline) {
            updatedTask = yield tasksModel_1.default.updateOne({ title, deadline });
        }
        else if (title && !deadline) {
            updatedTask = yield tasksModel_1.default.updateOne({ title });
        }
        else if (!title && deadline) {
            updatedTask = yield tasksModel_1.default.updateOne({ deadline });
        }
        else {
            return res.status(400).json("No value was provided to update");
        }
        return res.status(200).json({ message: "Task is updated", updatedTask });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Error occured while updating a task");
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        if (!_id)
            return res.status(400).json("Some of req.body values is missing");
        const deletedTask = yield tasksModel_1.default.deleteOne({ _id });
        return res.status(200).json({ message: "Task is deleted.", deletedTask });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Error occured while deleting a task");
    }
});
exports.deleteTask = deleteTask;
