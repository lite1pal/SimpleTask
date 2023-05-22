import { User } from "../models/usersModel";

const getUsers = async (req: any, res: any) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const createUser = async (req: any, res: any) => {
  try {
    const newUser = new User({
      name: "Denis",
      email: "deniskatasenko6@gmail.com",
      password: "Denis12345",
      age: 15,
    });
    await newUser.save();
    return res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export { getUsers, createUser };
