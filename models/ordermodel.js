const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  deliveryId: { type: String },
  pickup_location: { type: String, required: true },
  delivery_location: { type: String, required: true },
  pickup_longitude: { type: String },
  pickup_latitude: { type: String },
  delivery_longitude: { type: String },
  delivery_latitude: { type: String },
  delivery_phonenumber: { type: String },
  courier_note: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
