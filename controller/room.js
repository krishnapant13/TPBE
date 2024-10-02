const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utills/ErrorHandler");
const Room = require("../model/room");
const Guest = require("../model/guest");
const Booking = require("../model/booking");
const sendMail = require("../utills/sendMail");
const bookingConfirmationMail = require("../utills/bookingConfirmationMail");

router.get("/check-availability", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking availability", error: error.message });
  }
});

router.get("/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error("Error fetching room details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const sendBookingConfirmation = async (bookingDetails, guestDetails) => {
  const message = bookingConfirmationMail(
    bookingDetails,
    guestDetails.firstName
  );
  const mailOptions = {
    email: guestDetails.emailAddress,
    subject: "Booking Confirmation",
    message,
  };

  try {
    await sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
  }
};
router.post("/bookRoom", async (req, res) => {
  const { bookingDetails, userDetails, paymentMethod, guests } = req.body;
  try {
    const startDate = new Date(bookingDetails.checkInDate);
    const endDate = new Date(bookingDetails.checkOutDate);
    const room = bookingDetails?.room;
    const roomId = bookingDetails?.room?._id;
    const roomToUpdate = await Room.findById(roomId);

    if (!roomToUpdate) {
      return res.status(400).json({
        message: "Room not found.",
      });
    }

    await Room.findByIdAndUpdate(roomId, {
      $push: {
        bookedDates: {
          startDate: startDate,
          endDate: endDate,
        },
      },
    });

    await Room.findByIdAndUpdate(roomId, {
      $set: { nextAvailableDate: roomToUpdate.bookedDates[0]?.endDate },
    });

    const bookedRoom = await Room.findById(roomId);

    const newBooking = new Booking({
      room: room,
      guest: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.emailAddress,
        phoneNumber: userDetails.phoneNumber,
        state: userDetails.state,
        country: userDetails.country,
        zipCode: userDetails.zipCode,
        address: userDetails.address,
      },
      guests: guests,
      checkInDate: startDate,
      checkOutDate: endDate,
      guestCount: bookingDetails.guestCount,
      paymentMethod,
      calculatedPrice: bookingDetails.calculatedPrice,
    });

    await newBooking.save();
    await Guest.findByIdAndUpdate(userDetails._id, {
      $push: {
        bookedRooms: {
          roomId: roomId,
          checkInDate: startDate,
          checkOutDate: endDate,
          bookedOn: new Date(),
          bookingDetails: bookingDetails,
          guests: guests,
        },
      },
    });
    sendBookingConfirmation(bookingDetails, userDetails);
    res.status(200).json({ message: "Booking successful", bookedRoom });
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
});

module.exports = router;
