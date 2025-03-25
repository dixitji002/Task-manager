import React, { useEffect, useState } from "react";
import TaskCard from "../../components/Cards/TaskCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditTask from "./AddEditTask";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

Modal.setAppElement("#root");

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      setUserInfo(currentUser?.rest);
      getAllTasks();
    }
  }, [currentUser, navigate]);

  const getAllTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/task/all", {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        throw new Error(res.data.message);
      }

      setAllTasks(res.data.tasks || []);
      setFilteredTasks(res.data.tasks || []); // Initialize filtered tasks
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setAllTasks([]);
      setFilteredTasks([]);
      toast.error("Failed to fetch tasks.");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredTasks(allTasks);
      return;
    }

    const filtered = allTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.content.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredTasks(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredTasks(allTasks);
  };

  const handleEdit = (taskDetails) => {
    if (!taskDetails) {
      toast.error("Task details missing!");
      return;
    }
    setOpenAddEditModal({ isShown: true, data: taskDetails, type: "edit" });
  };

  const deleteTask = async (task) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/task/delete/${task._id}`,
        {
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllTasks();
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={handleSearch}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto">
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 max-md:m-5">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => handleEdit(task)}
                onDelete={() => deleteTask(task)}
                getAllTasks={getAllTasks}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={searchQuery ? "search_image_url" : "default_empty_image_url"}
            message={
              searchQuery
                ? "No Tasks found matching your search"
                : "Click 'Add' to start managing tasks."
            }
          />
        )}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#2B85FF] hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal isOpen={openAddEditModal.isShown} contentLabel="Add/Edit Task">
        <AddEditTask
          onClose={() => setOpenAddEditModal({ isShown: false })}
          taskData={openAddEditModal.data}
          type={openAddEditModal.type}
          getAllTasks={getAllTasks}
          userId={currentUser?._id}
        />
      </Modal>
    </>
  );
};

export default Home;
