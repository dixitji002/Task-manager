import React, { useState, useCallback } from "react";
import SearchBar from "./SearchBar/SearchBar";
import ProfileInfo from "./Cards/ProfileInfo";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import {
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      onSearchNote(searchQuery); 
    }
  }, [searchQuery, onSearchNote]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    onSearchNote(e.target.value); // 🔹 Real-time search update (optional)
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const onClearSearch = useCallback(() => {
    setSearchQuery("");
    handleClearSearch();
  }, [handleClearSearch]);

  const onLogout = async () => {
    try {
      dispatch(signoutStart());

      const res = await axios.get("http://localhost:3000/api/auth/signout", {
        withCredentials: true,
      });

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      toast.success(res.data.message);
      dispatch(signoutSuccess());
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      dispatch(signoutFailure(errorMessage));
    }
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <Link to="/">
        <h2 className="text-xl font-medium text-black py-2">
          <span className="text-slate-500">Task</span>
          <span className="text-slate-900">Manager</span>
        </h2>
      </Link>

      <SearchBar
        value={searchQuery}
        onChange={handleInputChange}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
        onKeyDown={handleKeyDown} // 🔹 Add key press event
      />

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
