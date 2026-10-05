const ErrorHandler = require("../util/errorhandler");

module.exports = (err, req, res, next) => {
  if (err.code == 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.statusCode = 400;
    err.message = `${field} already exists`;
  }

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  console.log("STATUS:", err.statusCode);
  console.log("MESSAGE:", err.message);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    
  });
};
