const mongoose = require("mongoose");

const ReferralCodeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  referralCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  usageCount: { type: Number, default: 0 }, // Tracks how many times the referral code has been used
});

const ReferralCode = mongoose.model("ReferralCode", ReferralCodeSchema);

module.exports = ReferralCode;
