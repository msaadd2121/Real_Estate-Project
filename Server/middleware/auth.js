const { User } = require("../models/user");
const { ErrorHandler } = require("../util/errorhandler");
const jwt = require("jsonwebtoken");

async function AuthenticatedUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler("please login to access this ", 404));
  }
  const decodedata = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedata.id);
  next();
}
module.exports = {
  AuthenticatedUser,
};
