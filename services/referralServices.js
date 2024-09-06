const ReferralCode = require("../models/referralModel");
const logger = require("../utils/logger");

const createReferralCode = async (userId) => {
  try {
    const newReferralCode = `${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const userReferralCode = new ReferralCode({
      userId: userId,
      referralCode: newReferralCode,
      createdAt: Date.now(),
    });

    await userReferralCode.save();
    return newReferralCode;
  } catch (err) {
    logger.info("referraServices/createReferralCode", err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

const findReferralCodeByUserId = async (referralCode) => {
  try {
    const referralCodeDetail = await ReferralCode.findOne({
      referralCode: referralCode,
    });
    logger.info(`Referral code details found for ${referralCodeDetail.userId}`);
    return referralCodeDetail;
  } catch (err) {
    logger.info(err.message);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

const processReferral = async (referralCode) => {
  try {
    // Find the referral code and associated user
    const referrer = await ReferralCode.findOne({ referralCode });

    if (!referrer) {
      throw new Error("Referral code not found");
    }

    // Increment the referral count for the referrer
    referrer.usageCount += 1;
    await referrer.save();
  } catch (err) {
    throw new Error(`Error processing referral: ${err.message}`);
  }
};

const processReversal = async (referralCode) => {
  try {
    // Find the referral code and associated user
    const referrer = await ReferralCode.findOne({ referralCode });

    if (!referrer) {
      throw new Error("Referral code not found");
    }

    // Increment the referral count for the referrer
    referrer.usageCount -= 1;
    await referrer.save();
  } catch (err) {
    throw new Error(`Error processing referral: ${err.message}`);
  }
};

module.exports = {
  createReferralCode,
  findReferralCodeByUserId,
  processReferral,
  processReversal,
};
