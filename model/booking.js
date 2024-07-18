const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    guest: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
      additionalMessage: { type: String },
    },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guestCount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    calculatedPrice: { type: Number, required: true },
    paymentStatus: { type: String, required: true, default: "unpaid" },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
