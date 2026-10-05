const express = require("express");
const {
  UserSignUp,
  UserSignIn,
  SignInUpfromGoogle,
  UserUpdate,
  UserSignout,
  GetCurrentUser,
  GetUser,
} = require("../controllers/user");
const { AuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

router.post("/signup", UserSignUp);
router.post("/signin", UserSignIn);
router.get("/me", AuthenticatedUser, GetCurrentUser);
router.post("/google", SignInUpfromGoogle);
router.post("/update/:id", AuthenticatedUser, UserUpdate);
router.get("/logout",UserSignout)
router.get("/user/:id",AuthenticatedUser,GetUser)

module.exports = router;
