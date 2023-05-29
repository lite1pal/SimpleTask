import mongoose, { Schema, Document } from "mongoose";

interface ITask extends Document {
  title: string;
  completed: boolean;
  deadline: Date;
  user: mongoose.Types.ObjectId;
}

const taskSchema: Schema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
  deadline: { type: Date, required: true, default: "2100-06-01T12:00:00" },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
