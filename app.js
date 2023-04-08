const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const errorController = require("./controllers/error");
// const User = require("./models/user");
const app = express();
const mongoose = require("mongoose");

const corsOptions = {
  origin: "*",
  methods: "GET,POST",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};
app.use(cors({ corsOptions }));
const adminRoutes = require("./routes/admin");
const hotelRoutes = require("./routes/hotels");
// const user = require("./models/user");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
app.use(adminRoutes);
app.use(hotelRoutes);

app.use(errorController.get404);
mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/asm2")
  .then((result) => {
    app.listen(5000);
    console.log("đang chạy port 3000");
  })
  .catch((err) => console.log(err));
