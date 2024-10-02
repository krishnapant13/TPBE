const express = require("express");
const router = express.Router();
const Booking = require("../model/booking");

router.get("/get-bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking availability", error: error.message });
  }
});

module.exports = router;
