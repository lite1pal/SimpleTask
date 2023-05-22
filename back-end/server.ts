import http from "http";
import { app } from "./app";
import dotenv from "dotenv";

const server = http.createServer(app);
dotenv.config();

const port = process.env.SERVER_PORT || 4001;

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
