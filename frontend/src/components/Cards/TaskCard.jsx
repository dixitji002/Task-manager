import React, { useState } from "react";
import { MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";

const TaskCard = ({ task = {}, onEdit, onDelete, getAllTasks }) => {
  if (!task || Object.keys(task).length === 0) {
    return <div className="p-4 bg-gray-100 rounded">Loading task...</div>;
  }

  const { _id, title, createdAt, content, isState } = task;
  const [taskState, setTaskState] = useState(isState || "Pending");

  const toggleTaskState = async () => {
    try {
      const newState = taskState === "Complete" ? "Pending" : "Complete";
      const res = await axios.put(
        `http://localhost:3000/api/task/edit/${_id}`,
        { isState: newState },
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      setTaskState(newState);
      toast.success(`Task marked as ${newState}`);
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title || "Untitled Task"}</h6>
          <span className="text-xs text-green-700">
            {createdAt ? moment(createdAt).format("Do MMM YYYY") : "Unknown Date"}
          </span>
        </div>

        <span
          className={`px-2 py-1 text-xs font-semibold rounded ${
            taskState === "Complete" ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"
          }`}
        >
          {taskState}
        </span>
      </div>

      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60) || "No content available"}</p>

      <div className="flex items-center justify-between mt-2">
        <button
          onClick={toggleTaskState}
          className={`text-xs px-3 py-1 rounded font-medium ${
            taskState === "Complete" ? "bg-yellow-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          Mark as {taskState === "Complete" ? "Pending" : "Complete"}
        </button>

        <div className="flex gap-2">
          <MdCreate className="icon-btn hover:text-green-600 cursor-pointer" onClick={onEdit} />
          <MdDelete className="icon-btn hover:text-red-500 cursor-pointer" onClick={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

