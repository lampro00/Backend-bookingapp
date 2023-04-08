const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userSchema = new schema({
  username: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  fullName: String,
  phoneNumber: Number,
  email: String,
  isAdmin: Boolean,
});   

module.exports = mongoose.model("users", userSchema);
