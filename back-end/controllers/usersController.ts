import { NextFunction, Request, Response } from "express";
import User from "../models/usersModel";
import { server } from "../server";

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
    const { name, email, password, age } = req.body;
    if (!name || !email || !password || !age)
      return res.status(400).json("Some input field value is missing");

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(404).json("User with such email is created already");
    const newUser = await User.create({
      name,
      email,
      password,
      age,
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

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const clientSessionId = req.headers.authorization?.split(" ")[1];
  const clientEmail = req.headers.authorization?.split(" ")[2];
  if (!clientSessionId || !clientEmail)
    return res.status(401).json("authorization data is missing");

  const user = await User.findOne({
    email: clientEmail,
    sessionId: clientSessionId,
  });

  const serverSessionId = user?.sessionId;

  if (!user || serverSessionId !== clientSessionId)
    return res.status(404).json("Authorization failed");

  next();
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const deletedUser = await User.deleteOne({ name });
    return res.status(200).json({ message: "User is deleted.", deletedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error occured while deleting a user");
  }
};

export { getUsers, getSingleUser, createUser, authUser, checkAuth, deleteUser };
