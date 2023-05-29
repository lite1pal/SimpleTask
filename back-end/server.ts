import http from "http";
import { app } from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";

const server = http.createServer(app);
dotenv.config();

const port = process.env.SERVER_PORT || 4001;
const ATLAS_URI = process.env.ATLAS_URI || "";

const startServer = async () => {
  try {
    await mongoose.connect(ATLAS_URI);
    server.listen(port, () => {
      console.log(`MongoDB connected, server is on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
};

startServer();

export { server };
