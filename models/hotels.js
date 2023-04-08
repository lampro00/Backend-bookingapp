const mongoose = require("mongoose");
const type = require("mongoose/lib/schema/operators/type");
const { array } = require("mongoose/lib/utils");
const schema = mongoose.Schema;
const hotelSchema = new schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  distance: { type: Number, required: true },
  photos: Array,
  desc: { type: String, required: true },
  rating: Number,
  featured: Boolean,
  cheapestPrice: { type: Number, required: true },
  title: { type: String, required: true },
  rooms: [{ type: String, required: true }],
});

module.exports = mongoose.model("hotels", hotelSchema);
