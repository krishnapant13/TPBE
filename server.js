const app = require("./app");
const connectDatabase = require("./db/database");
const Room = require("./model/room");
const roomData = require("./utills/roomData.json");

// Handling uncought exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Sutting down the server for handling uncought exception");
});
//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./.env",
  });
}

//connect db
connectDatabase();

const seedDatabase = async () => {
  try {
    const existingRooms = await Room.find();

    if (existingRooms.length === 0) {
      await Room.insertMany(roomData);
      console.log("Database seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();
//creating a server
const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Sutting down the server for ${err.message} `);
  console.log("sutting down the server for unhandled promise rejection");
  server.close(() => {
    process.exit();
  });
});
