import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isState: {
    type: String,
    enum: ["Pending", "Complete"], 
    default: "Pending", 
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task; 

