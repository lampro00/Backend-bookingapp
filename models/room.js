const mongoose = require("mongoose");
const schema = mongoose.Schema;
const RoomSchema = new schema({
  title: String,
  price: Number,
  maxPeople: Number,
  desc: String,
  roomNumbers: Array,
});

module.exports = mongoose.model("room", RoomSchema);
