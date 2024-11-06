const jwt = require("jsonwebtoken");
const Guest = require("../model/guest");
const ErrorHandler = require("../utills/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await Guest.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found. Please login again.", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token, please login again", 401));
  }
});
