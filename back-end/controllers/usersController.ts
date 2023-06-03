import { NextFunction, Request, Response } from "express";
import User from "../models/usersModel";
import Task from "../models/tasksModel";

import { verifyJWT } from "../services/google";

import {
  validatePassword,
  hashPassword,
  comparePassword,
} from "../helpers/helpers";

const getUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const getSingleUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name } = req.params;
    const user = await User.findOne({ name });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    // gets name, email, password and age values from the request body
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json("Some input field value is missing");

    if (!validatePassword) return res.status(400).json("Password is invalid");
    const hashedPassword = await hashPassword(password);
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(404).json("User with such email is created already");
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      sessionId: "pending",
    });
    await newUser.save();
    return res.status(200).json({ message: "User was created!", newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const authUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json("Some input field value is missing");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("There is no user with such email");

    const isPasswordTheSame = await comparePassword(password, user.password);
    if (!isPasswordTheSame)
      return res.status(401).json("Password is incorrect for this user");
    const updatedUser = await User.findOneAndUpdate(
      {
        email,
      },
      { sessionId: req.sessionID },
      { new: true }
    );

    await updatedUser?.save();

    return res.status(200).json({
      message: "User was authorized!",
      user,
      sessionId: req.sessionID,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const authUserGoogle = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ message: "There is no provided token" });

    const user = await verifyJWT(process.env.GOOGLE_CLIENT_ID, token);
    if (!user)
      return res
        .status(401)
        .json({ message: "token was not verified by google" });
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      const newUser = await User.create({
        name: user.given_name,
        email: user.email,
        password: user.sub,
        sessionId: req.sessionID,
      });
      await newUser.save();
      const { _id, name, email, sessionId } = newUser;

      return res.status(200).json({
        message: "User was verified by Google!",
        user: { _id, name, email, sessionId },
      });
    } else {
      return res.status(200).json({
        message: "User was verified by Google!",
        user: {
          name: existingUser.name,
          email: existingUser.email,
          sessionId: existingUser.sessionId,
          _id: existingUser._id,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json("Error occured while authorizing a user via Google");
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "There is no user with such email" });
    // deletes all tasks of the user
    await Task.deleteMany({ user: user._id });
    // deletes the user
    const deletedUser = await User.deleteOne({ email });
    return res.status(200).json({ message: "User is deleted.", deletedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error occured while deleting a user");
  }
};

export {
  getUsers,
  getSingleUser,
  createUser,
  authUser,
  authUserGoogle,
  deleteUser,
};
