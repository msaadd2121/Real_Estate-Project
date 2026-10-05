import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/UserSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux se loading aur error
  const { loading, error } = useSelector((state) => state.user);

  const Submit = (e) => {
    e.preventDefault();

    dispatch(signInStart());

    axios
      .post(
        "http://localhost:5000/api/signin",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then((result) => {
        console.log(result);

        // Backend se user data Redux mein save
        dispatch(signInSuccess(result.data.user));

        // Login successful
        navigate("/");
      })
      .catch((err) => {
        console.log(err);

        const message =
          err.response?.data?.message ||
          "Something went wrong";

        // Error Redux mein save
        dispatch(signInFailure(message));
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7f7] px-3 py-8 sm:px-5">
      <div className="w-full max-w-130">

        <div className="rounded-lg bg-white px-4 py-7 shadow-sm sm:px-8 sm:py-8 md:px-10">

          {/* Heading */}
          <h1 className="mb-7 text-center text-2xl font-bold text-black sm:text-3xl">
            Sign In
          </h1>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-3" onSubmit={Submit}>

            {/* Email */}
            <input
              type="email"
              placeholder="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-gray-400 disabled:bg-gray-100"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-gray-400 disabled:bg-gray-100"
            />

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 h-11 w-full rounded-md bg-[#2f4058] text-sm font-medium uppercase text-white transition hover:bg-[#26364c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <OAuth/>

          </form>

          {/* Sign Up */}
          <p className="mt-4 text-left text-xs text-gray-800 sm:text-sm">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="font-medium text-[#2563eb] hover:underline"
            >
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}