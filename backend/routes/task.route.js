import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  addTask,
  deleteTask,
  editTask,
  getAllTasks,
  searchTask,
  updateTaskState,
} from "../controller/task.controller.js";

const router = express.Router();

router.post("/add", verifyToken, addTask);
router.put("/edit/:taskId", verifyToken, editTask);
router.get("/all", verifyToken, getAllTasks);
router.delete("/delete/:taskId", verifyToken, deleteTask);
router.put("/update-task-state/:taskId", verifyToken, updateTaskState);
router.get("/search", verifyToken, searchTask);

export default router;

