import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

export { User };
