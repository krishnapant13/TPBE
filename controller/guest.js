const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Guest = require("../model/guest");
const { isAuthenticated } = require("../middleware/auth");
const ErrorHandler = require("../utills/ErrorHandler");
const sendToken = require("../utills/jwtToken");
const multer = require("multer");

const uploadToCloudinary = require("../utills/cloudinaryUploads");
const upload = multer().single("avatar");
// Create guest (signup)
router.post("/create-guest", upload, async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      address,
      state,
      country,
      zipCode,
      password,
    } = req.body;

    const guestEmail = await Guest.findOne({ emailAddress });
    if (guestEmail) {
      return next(new ErrorHandler("Guest already exists, Please Login", 400));
    }
    const imageUrl = await uploadToCloudinary(req.file.buffer);
    console.log("url", imageUrl);

    const guest = await Guest.create({
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      password,
      address,
      state,
      country,
      zipCode,
      avatar: imageUrl,
      verified: true,
    });

    sendToken(guest, 201, res);
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});

// Login guest
router.post(
  "/login-guest",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please provide all fields!", 400));
    }

    const guest = await Guest.findOne({ emailAddress: email }).select(
      "+password"
    );
    if (!guest) {
      return next(new ErrorHandler("Guest doesn't exist", 400));
    }

    const isPasswordValid = await guest.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Wrong password entered", 400));
    }

    sendToken(guest, 201, res);
  })
);

// Logout guest
router.get(
  "/logout",
  // isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(201).json({
      success: true,
      message: "Logout Successful",
    });
  })
);

//update use avatar

router.put(
  "/update-avatar",
  // isAuthenticated,
  upload,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      const user = await User.findByIdAndUpdate(req.user.id, {
        avatar: imageUrl,
      });
      if (!req.file) {
        return next(new ErrorHandler("No file uploaded", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
