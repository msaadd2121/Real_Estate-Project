import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/UserSlice";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      dispatch(signInStart());

      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // Google Sign In
      const result = await signInWithPopup(auth, provider);

      // Google se user data
      const user = result.user;

      const name = user.displayName;
      const email = user.email;
      const photo = user.photoURL;

      console.log("Google photoURL:", photo);

      // Backend ko data send
      const response = await axios.post(
        "http://localhost:5000/api/google",
        {
          name,
          email,
          photo,
        },
        {
          withCredentials: true,
        },
      );

      // Redux mein user save
      dispatch(signInSuccess(response.data.user));

      // Home page
      navigate("/");
    } catch (error) {
      console.log("Could not sign in with Google.", error);

      dispatch(
        signInFailure(
          error.response?.data?.message || "Could not sign in with Google.",
        ),
      );
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="mt-1 h-11 w-full rounded-md bg-red-700 p-3 uppercase text-white hover:opacity-95"
    >
      Continue with Google
    </button>
  );
}

export default OAuth;
