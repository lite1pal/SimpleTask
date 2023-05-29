import { Request, Response } from "express";
import Task from "../models/tasksModel";

const getTasks = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const tasks = await Task.find({ user: user_id });
    return res.status(200).json({ message: "Tasks are retrieved.", tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error occured while retrieving users");
  }
};

const getSingleTask = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error occured while retrieving a user");
  }
};

const createTask = async (req: Request, res: Response) => {
  try {
    const { title, deadline, user_id } = req.body;
    if (!title || !user_id)
      return res.status(400).json("Some of req.body values is missing");

    let newTask: any;
    if (!deadline) {
      newTask = await Task.create({ title, user: user_id });
    } else {
      newTask = await Task.create({ title, deadline, user: user_id });
    }
    return res.status(200).json({ message: "Task is created.", newTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error occured while creating a task");
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    if (!_id) return res.status(400).json("Some of req.body values is missing");

    const deletedTask = await Task.deleteOne({ _id });
    return res.status(200).json({ message: "Task is deleted.", deletedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error occured while deleting a task");
  }
};

export { getTasks, createTask, deleteTask };
