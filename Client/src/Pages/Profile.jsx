import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOut,
} from "../redux/user/UserSlice";

export default function Profile() {
  const dispatch = useDispatch();

  const currentuser = useSelector((state) => state.user.currentUser);

  const loading = useSelector((state) => state.user.loading);

  const error = useSelector((state) => state.user.error);

  const fileref = useRef(null);

  const listingsRef = useRef(null);

  const [username, setUsername] = useState(currentuser?.username || "");

  const [email, setEmail] = useState(currentuser?.email || "");

  const [password, setPassword] = useState("");

  const [userListings, setUserListings] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const data = {
        username,
        email,
      };

      // Password sirf tab bhejna hai
      // jab user new password enter kare
      if (password.trim()) {
        data.password = password;
      }

      const res = await axios.post(
        `http://localhost:5000/api/update/${currentuser._id}`,
        data,
        {
          withCredentials: true,
        },
      );

      // Redux mein updated user save hoga
      dispatch(updateUserSuccess(res.data));

      // Password input clear
      setPassword("");

      alert("Profile updated successfully!");
    } catch (error) {
      console.log(error);

      dispatch(
        updateUserFailure(
          error.response?.data?.message || "Something went wrong!",
        ),
      );
    }
  };

  const handleShowListing = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/listings/${currentuser._id}`,
        {
          withCredentials: true,
        },
      );

      console.log("User Listings:", res.data);

      setUserListings(res.data);
      setTimeout(() => {
        listingsRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/delete/${listingId}`,
        {
          withCredentials: true,
        },
      );

      console.log("Listing deleted:", res.data);

      // UI se bhi listing remove kar do
      setUserListings(
        userListings.filter((listing) => listing._id !== listingId),
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleSignOut = async () => {
  try {
    await axios.get("http://localhost:5000/api/logout", {
      withCredentials: true,
    });

    dispatch(signOut());

    window.location.href = "/sign-in";
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* PROFILE SECTION */}
      <div className="w-full max-w-md px-4 pt-8">
        <h1 className="text-center text-2xl font-bold text-slate-800">
          Profile
        </h1>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* File Input */}
          <input type="file" ref={fileref} hidden accept="image/*" />

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <img
              onClick={() => fileref.current.click()}
              src={currentuser?.avatar}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover cursor-pointer"
            />
          </div>

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-11 px-3 mb-3 bg-white outline-none border border-slate-200 rounded"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-3 mb-3 bg-white outline-none border border-slate-200 rounded"
          />

          {/* New Password */}
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 px-3 mb-3 bg-white outline-none border border-slate-200 rounded"
          />

          {/* Error */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Update */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-slate-700 text-white font-medium rounded disabled:opacity-50"
          >
            {loading ? "UPDATING..." : "UPDATE"}
          </button>

          {/* Create Listing */}
          <div className="mt-3">
            <Link
              to="/create-listing"
              className="block w-full h-11 bg-green-700 text-white text-center py-3 rounded-md font-semibold hover:bg-green-800"
            >
              Create Listing
            </Link>
          </div>
        </form>

        {/* Bottom Buttons */}
        <div className="flex justify-between mt-3 text-sm">
          <button type="button" className="text-red-600 cursor-pointer">
            Delete account
          </button>

          <button   onClick={handleSignOut} type="button" className="text-red-600 cursor-pointer">
            Sign out
          </button>
        </div>

        {/* Show Listing */}
        <button
          onClick={handleShowListing}
          className="text-green-700 w-full cursor-pointer mt-3"
        >
          Show Listing
        </button>
      </div>

      {/* USER LISTINGS */}
      {userListings && userListings.length > 0 && (
        <div
          ref={listingsRef}
          className="w-full max-w-md px-4 flex flex-col gap-4 mt-7 pb-8"
        >
          <h1 className="text-center text-2xl font-semibold">Your Listings</h1>

          {userListings.map((listing) => (
            <div key={listing._id} className="flex items-center gap-4 w-full">
              {/* Image */}
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls?.[0]?.url}
                  alt="listing cover"
                  className="h-16 w-16 object-contain "
                />
              </Link>

              {/* Listing Name */}
              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              {/* Buttons */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase cursor-pointer"
                >
                  Delete
                </button>

                <Link
                  to={`/update-listing/${listing._id}`}
                  className="text-green-700 uppercase"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
