import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const ATLAS_URI = process.env.ATLAS_URI || "";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(ATLAS_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
};

export { connectToDatabase };
