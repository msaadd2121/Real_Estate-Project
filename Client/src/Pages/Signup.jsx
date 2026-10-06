import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import OAuth from "../components/OAuth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const Submit = (e) => {
    e.preventDefault();

    // Purana error clear karo
    setError("");

    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/api/signup`,
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        },
      )
      .then((result) => {
        console.log(result);

        // Signup successful
        navigate("/");
      })
      .catch((err) => {
        console.log(err);

        // Backend se message lena
        if (err.response && err.response.data) {
          setError(err.response.data.message || "Something went wrong");
        } else {
          setError("Unable to connect to server");
        }
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7f7] px-3 py-8 sm:px-5">
      <div className="w-full max-w-130">
        {/* Signup Card */}
        <div className="rounded-lg bg-white px-4 py-7 shadow-sm sm:px-8 sm:py-8 md:px-10">
          {/* Heading */}
          <h1 className="mb-7 text-center text-2xl font-bold text-black sm:text-3xl">
            Sign Up
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-3" onSubmit={Submit}>
            {/* Username */}
            <input
              type="text"
              placeholder="username"
              value={username}
              className="h-11 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-gray-400"
              onChange={(e) => setUsername(e.target.value)}
            />

            {/* Email */}
            <input
              type="email"
              placeholder="email"
              value={email}
              className="h-11 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-gray-400"
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <input
              type="password"
              placeholder="password"
              value={password}
              className="h-11 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-gray-400"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Signup Button */}
            <button
              type="submit"
              className="mt-1 h-11 w-full rounded-md bg-[#2f4058] text-sm font-medium uppercase text-white transition hover:bg-[#26364c] active:scale-[0.99]"
            >
              Sign Up
            </button>
            <OAuth/>
         

          </form>

          {/* Sign In */}
          <p className="mt-4 text-left text-xs text-gray-800 sm:text-sm">
            Have an account?{" "}
            <Link
              to="/sign-in"
              className="font-medium text-[#2563eb] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
