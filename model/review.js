const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
