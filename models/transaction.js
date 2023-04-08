const mongoose = require("mongoose");

const hotelSchema = require("./hotels");
const schema = mongoose.Schema;
const TransactionSchema = new schema({
  user: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
  },
  hotel: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
  },
  rooms: {
    type: Object,
  },
  dateStart: { type: Date },
  dateEnd: { type: Date },
  price: { type: Number },
  payment: { type: String },
  status: { type: String },
  datebook: { type: Date },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
