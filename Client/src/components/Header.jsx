import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/UserSlice";
import { Navigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/me", {
          withCredentials: true,
        });

        dispatch(signInSuccess(res.data.user));
      } catch (error) {
        console.log("User not logged in");
      }
    };

    getCurrentUser();
  }, [dispatch]);
  const currentuser = useSelector((state) => state.user.currentUser);

  const HandleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const searchTermfromUrl = urlparams.get("searchTerm");
    if (searchTermfromUrl) {
      setSearchTerm(searchTermfromUrl);
    }
  }, [location.search]);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Sahand</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={HandleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          ></input>
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>

          <Link to="/profile">
            {currentuser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentuser.avatar}
                alt="profile"
              />
            ) : (
              <li className=" text-slate-700 hover:underline">Signin</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
