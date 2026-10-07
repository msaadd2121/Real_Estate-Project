const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { ErrorHandler } = require("../util/errorhandler");
const { sendToken } = require("../util/jwttoken");

async function UserSignUp(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const user = await User.create({
      username,
      email,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    if (error.code === 11000) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    next(error);
  }
}
async function UserSignIn(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email or Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
}

async function SignInUpfromGoogle(req, res, next) {
  try {
    const { email, name, photo } = req.body;

    if (!email) {
      return next(new ErrorHandler("Email is required", 400));
    }

    // Check if user already exists
    const user = await User.findOne({ email });

    // ✅ Agar user pehle se exist karta hai — chahe email/password se bana ho
    // ya Google se — bas login kara do, naya account MAT banao
    if (user) {
      // Optional: agar authProvider field track kar rahe ho, aur user
      // pehle email/password se bana tha, toh Google se link kar do
      if (!user.authProvider || user.authProvider === "email") {
        user.authProvider = "email+google"; // ya jo bhi naming convention rakho
      }
      if (photo) {
        user.avatar = photo;
      }
      await user.save();

      console.log("Saved avatar:", user.avatar);

      return sendToken(user, 200, res);
    }

    // ❄️ Yahan pohanchne ka matlab user exist nahi karta — naya banao

    // Generate random password (kyunke Google user ko password ki zaroorat nahi)
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

    // Generate unique username
    const username =
      name.split(" ").join("").toLowerCase() +
      Math.random().toString(36).slice(-4);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: photo,
      authProvider: "google", // ✅ track karo kaise bana account
    });

    await newUser.save();

    return sendToken(newUser, 201, res); // naya resource bana hai, 201 zyada sahi hai
  } catch (error) {
    next(error);
  }
}

async function UserUpdate(req, res, next) {
  console.log("AUTH USER ID:", req.user.id);
  console.log("PARAM ID:", req.params.id);
  if (req.user.id !== req.params.id) {
    return next(new ErrorHandler("You can only update your own account!", 401));
  }

  try {
    const updateData = {
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
    };

    // Password sirf tab update hoga
    // jab new password bheja gaya ho
    if (req.body.password) {
      updateData.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
      },
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}

async function UserSignout(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
}
async function GetCurrentUser(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

async function GetUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(new ErrorHandler("user not found"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  UserSignUp,
  UserSignIn,
  SignInUpfromGoogle,
  UserUpdate,
  UserSignout,
  GetCurrentUser,
  GetUser,
};
