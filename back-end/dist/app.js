"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
// imports routers
const users_1 = require("./routes/users");
const tasks_1 = require("./routes/tasks");
// imports third-parties
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// configures express sessions
app.use((0, express_session_1.default)({
    secret: "secret",
    saveUninitialized: true,
    resave: false,
    cookie: {
        httpOnly: true,
    },
}));
// parses cookies
app.use((0, cookie_parser_1.default)());
// configures resources that are allowed to make requests to this server
app.use((0, cors_1.default)());
// secures a server by adding a lot of secure headers to incoming requests
app.use((0, helmet_1.default)());
// makes incoming requests more descriptive
app.use((0, morgan_1.default)("dev"));
// parses req.body in object
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// listens for routes
app.use("/users", users_1.usersRouter);
app.use("/tasks", tasks_1.tasksRouter);
