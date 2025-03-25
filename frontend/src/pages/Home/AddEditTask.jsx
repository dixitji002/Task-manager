import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const AddEditTask = ({ onClose, taskData, type, getAllTasks, userId }) => {
  const [title, setTitle] = useState(taskData?.title || "");
  const [content, setContent] = useState(taskData?.content || "");
  const [taskState, setTaskState] = useState(taskData?.isState || "Pending");
  const [error, setError] = useState("");

  // Edit Task
  const editTask = async () => {
    if (!taskData?._id) {
      setError("Invalid task data");
      return;
    }
  
    try {
      const updateData = {};
      if (title !== taskData.title) updateData.title = title;
      if (content !== taskData.content) updateData.content = content;
      if (taskState !== taskData.isState) updateData.isState = taskState; // 🔥 Fix
  
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes made.");
        return;
      }
  
      const res = await axios.put(
        `http://localhost:3000/api/task/edit/${taskData._id}`,
        { ...updateData, userId },
        { withCredentials: true }
      );
  
      if (!res.data.success) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }
  
      toast.success("Task updated successfully!");
      getAllTasks();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      toast.error(error.response?.data?.message || "Error updating task");
    }
  };

  // Add Task
  const addNewTask = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/task/add",
        { title, content, isState: taskState }, 
        { withCredentials: true }
      );
  
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
  
      toast.success("Task added successfully!");
      getAllTasks();
      onClose(); // Close modal after adding task
    } catch (error) {
      console.error("Task creation error:", error);
      toast.error(error.response?.data?.message || "Error adding task");
    }
  };
  

  const handleAddTask = () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!content.trim()) {
      setError("Please enter the content");
      return;
    }

    setError("");
    type === "edit" ? editTask() : addNewTask();
  };

  return (
    <div className="relative p-6 bg-white rounded-lg shadow-lg">
      {/* Close Button */}
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-gray-100"
        onClick={onClose}
      >
        <MdClose className="text-xl text-gray-600" />
      </button>

      {/* Title Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">Title</label>
        <input
          type="text"
          className="p-2 border rounded-md text-gray-800 outline-none"
          placeholder="Enter task title..."
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      {/* Content Input */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-sm font-semibold text-gray-600">Content</label>
        <textarea
          className="p-2 border rounded-md text-gray-800 outline-none"
          placeholder="Task details..."
          rows={4}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      {/* Task Status Select */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-sm font-semibold text-gray-600">Status</label>
        <select
          className="p-2 border rounded-md text-gray-800 outline-none"
          value={taskState}
          onChange={({ target }) => setTaskState(target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Complete">Complete</option>
        </select>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Submit Button */}
      <button
        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md mt-5 hover:bg-blue-600 transition duration-300"
        onClick={handleAddTask}
      >
        {type === "edit" ? "Update Task" : "Add Task"}
      </button>
    </div>
  );
};

export default AddEditTask;
