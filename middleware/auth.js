// const ErrorHandler = require("../utills/ErrorHandler");
// const catchAsyncErrors = require("./catchAsyncErrors");
// const jwt = require("jsonwebtoken");
// // exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
// //   const { token } = req.cookies;
// //   if (!token) {
// //     return next(new ErrorHandler("Please login to continue", 401));
// //   }
// //   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
// //   req.user = await User.findById(decoded.id);
// //   next();
// // });

// exports.isSeller = catchAsyncErrors(async (req, res, next) => {
//   const { seller_token } = req.cookies;
//   if (!seller_token) {
//     return next(new ErrorHandler("Please login to continue", 401));
//   }
//   const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
//   req.seller = await Shop.findById(decoded.id);
//   next();
// });

// // exports.isAdmin = (...roles) => {
// //   return (req, res, next) => {
// //     if (!roles.includes(req.user.role)) {
// //       return next(
// //         new ErrorHandler(`${req.user.role} can not access this resources!`)
// //       );
// //     }
// //     next();
// //   };
// // };
const jwt = require("jsonwebtoken");
const Guest = require("../model/guest");
const ErrorHandler = require("../utills/ErrorHandler");

exports.isAdminAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("You are not logged in", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await Guest.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return next(new ErrorHandler("Access denied, admin only!", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token, please log in again", 401));
  }
};
