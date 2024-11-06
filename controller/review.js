const express = require("express");
const Review = require("../model/review");
const Guest = require("../model/guest");
const Room = require("../model/room");
const ErrorHandler = require("../utills/ErrorHandler");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

router.post("/add-review/:roomId", isAuthenticated, async (req, res) => {
  const { roomId } = req.params;
  const { rating, reviewText } = req.body;

  try {
    const guest = await Guest.findById(req.user.id);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    // Fetch the room details to get the room name
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    // Create a new review
    const review = new Review({
      guestName: guest.firstName + " " + guest.lastName,
      avatar: guest.avatar,
      roomName: room.heading,
      rating,
      reviewText,
    });

    await review.save();

    res.status(200).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/all-reviews", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete(
  "/delete-review/:reviewId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const review = await Review.findById(req.params.reviewId);
      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }

      await review.remove();

      res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler("Error deleting review", 500));
    }
  }
);

module.exports = router;
