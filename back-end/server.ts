import http from "http";
import { app } from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const server = http.createServer(app);

const port = process.env.SERVER_PORT || 4001;
const ATLAS_URI = process.env.ATLAS_URI || "";

const startServer = async () => {
  try {
    await mongoose.connect(ATLAS_URI);
    server.listen(port, () => {
      console.log(
        `MongoDB connected, server is on ${process.env.API_URL}:${port}`
      );
    });
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
};

startServer();

export { server };
