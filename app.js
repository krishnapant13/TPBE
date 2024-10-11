const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://trishulregency.in",
      "https://www.trishulregency.in",
      "https://trishulregency.com",
      "https://www.trishulregency.com",
      "https://krishnapant13.github.io",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
//comment this for local
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://trishulregency.in");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./.env",
  });
}
// import routes
const guest = require("./controller/guest");
const room = require("./controller/room");
const booking = require("./controller/booking");

app.use("/api/v2/guest", guest);
app.use("/api/v2/room", room);
app.use("/api/v2/booking", booking);

//error handling
app.use(ErrorHandler);
module.exports = app;
