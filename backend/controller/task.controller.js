import Task from "../models/task.model.js";
import { errorHandler } from "../utils/error.js";

// Add a new task
export const addTask = async (req, res, next) => {
  try {
    const { title, content, isState } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false, // 👈 Make sure success is always present
        message: "Title and content are required",
      });
    }

    const task = new Task({ title, content, isState, userId: req.user.id });
    await task.save();

    res.status(201).json({
      success: true,
      message: "Task added successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false, // 👈 Ensure success is false in case of failure
      message: "Failed to add task",
    });
  }
};


export const editTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return next(errorHandler(404, "Task not found"));

    if (req.user.id !== task.userId.toString()) {
      return next(errorHandler(401, "Unauthorized"));
    }

    const { title, content, isState } = req.body;

    if (title) task.title = title;
    if (content) task.content = content;
    if (isState !== undefined) task.isState = isState; // Ensure it can be set to `false`

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};



export const getAllTasks = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a task
export const deleteTask = async (req, res, next) => {
  const taskId = req.params.taskId;

  const task = await Task.findOne({ _id: taskId, userId: req.user.id });

  if (!task) return next(errorHandler(404, "Task not found"));

  try {
    await Task.deleteOne({ _id: taskId });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const updateTaskState = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) return next(errorHandler(404, "Task not found!"));
    if (req.user.id !== task.userId) return next(errorHandler(401, "Unauthorized"));

    const { isState } = req.body;
    if (!["Pending", "Complete"].includes(isState)) {
      return next(errorHandler(400, "Invalid task state"));
    }

    task.isState = isState;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const searchTask = async (req, res, next) => {
  const { query } = req.query;

  if (!query) return next(errorHandler(400, "Search query is required"));

  try {
    const matchingTasks = await Task.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Matching tasks retrieved successfully",
      tasks: matchingTasks,
    });
  } catch (error) {
    next(error);
  }
};
