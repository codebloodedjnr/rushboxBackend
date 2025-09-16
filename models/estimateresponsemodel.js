const mongoose = require("mongoose");

const EstimateResponseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  name: { type: String },
  response: { type: Object },
  picked: { type: Boolean },
});

const Estimate = mongoose.model("Estimate", EstimateResponseSchema);

module.exports = Estimate;
