import { Request, Response, NextFunction } from "express";
import User from "../models/usersModel";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  // gets user authorization values from req.headers.authorization string
  const clientSessionId = req.headers.authorization?.split(" ")[1];
  const clientEmail = req.headers.authorization?.split(" ")[2];

  // checks if there are provided values that can authorize a user
  if (!clientSessionId || !clientEmail)
    return res.status(401).json("authorization data is missing");

  // retrieves a user with such authorization values
  const user = await User.findOne({
    email: clientEmail,
    sessionId: clientSessionId,
  });

  // sets sessionId of retrieved user to serverSessionId variable
  const serverSessionId = user?.sessionId;

  // checks if there is user in database with such auth values and
  // if his sessionId is the same as the one provided via req.headers
  if (!user || serverSessionId !== clientSessionId) {
    console.log("problem here");
    console.log(user, serverSessionId, clientSessionId);
    return res.status(404).json("Authorization failed");
  }

  // gives access to resource and moves to its function
  next();
};

export { checkAuth };
