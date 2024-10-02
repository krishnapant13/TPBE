const app = require("./app");
const connectDatabase = require("./db/database");
const Room = require("./model/room");
const Guest = require("./model/guest");
const bcrypt = require("bcryptjs");
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
const seedAdmin = async () => {
  try {
    const adminEmail = "krishna555.pant@gmail.com";

    const existingAdmin = await Guest.findOne({ emailAddress: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("P@ssw0rd@admin", 10);

      await Guest.create({
        firstName: "Krishna",
        lastName: "Pant",
        emailAddress: adminEmail,
        phoneNumber: "1234567890",
        address: "Some Address",
        state: "Some State",
        country: "Some Country",
        zipCode: "123456",
        password: hashedPassword,
        verified: true,
        avatar: "admin-avatar-url",
        role: "admin",
        bookedRooms: [], // Admin may not have booked rooms
      });

      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

seedDatabase();
seedAdmin();
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
