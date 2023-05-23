import express from "express";
import session from "express-session";
const app = express();

// imported routers
import { usersRouter } from "./routes/users";

// configures express sessions
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// parses req.body in object
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// listen for routes
app.use("/users", usersRouter);

export { app };
