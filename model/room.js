const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  category: { type: String, required: true },
  heading: { type: String, required: true },
  subheading: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  mainPrice: { type: Number, required: true },
  image: { type: String, required: true },
  facility: [{ type: String }],
  roomCapacity: { type: Number, required: true },
  gallery: [{ type: String }],
  bookedDates: [{ startDate: Date, endDate: Date }],
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
