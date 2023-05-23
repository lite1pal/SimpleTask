import { Request, Response } from "express";
import { User } from "../models/usersModel";
// import { Session } from "express-session";

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
    const { name, email, password, age } = req.body;
    console.log(req.body);
    if (!name || !email || !password || !age)
      return res.status(404).json("Some input field value is missing");
    const newUser = new User({
      name,
      email,
      password,
      age,
    });
    await newUser.save();
    return res.status(200).json({ message: "User was created!", newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

interface Session {
  user: {
    id: string;
    name?: string;
    email?: string;
    password?: string;
    age?: number;
  };
}

const authUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const session = req.session as unknown as Session;
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(404).json("Some input field value is missing");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("There is no user with such email");

    session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
    };
    return res.status(200).json({ message: "User was authorized!", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const checkAuth = (req: Request, res: Response) => {
  const session = req.session as unknown as Session;
  if (!session.user) return res.status(404).json("User is unauthorized.");
  return res.status(404).json("User is authorized!");
};

export { getUsers, getSingleUser, createUser, authUser, checkAuth };
