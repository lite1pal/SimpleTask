import express from "express";
const app = express();

// imported routers
import { usersRouter } from "./routes/users";
import { tasksRouter } from "./routes/tasks";

// imported third-parties
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// configures express sessions
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
    },
  })
);

app.use(cookieParser());

// configures resources that are allowed to make requests to this server
app.use(cors());

// secures a server by adding a lot of secure headers to incoming requests
app.use(helmet());

// makes incoming requests more descriptive
app.use(morgan("dev"));

// parses req.body in object
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// listen for routes
app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

export { app };
