const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Room = require("./room");

const guestSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["guest", "admin"],
    default: "guest",
  },
  bookedRooms: [
    {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
      checkInDate: { type: Date, required: true },
      checkOutDate: { type: Date, required: true },
      bookedOn: { type: Date, default: Date.now },
      bookingDetails: {},
    },
  ],
});

guestSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

guestSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

guestSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

module.exports = mongoose.model("Guest", guestSchema);
