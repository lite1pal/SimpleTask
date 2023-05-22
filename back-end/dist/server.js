"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
const server = http_1.default.createServer(app_1.app);
dotenv_1.default.config();
const port = process.env.SERVER_PORT || 4001;
server.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
