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
const processReferral = async (referralCode, referredUserId) => {
  try {
    const referrer = await ReferralCode.findOne({ referralCode });

    if (!referrer) {
      throw new Error("Referral code not found");
    }

    referrer.usageCount += 1;
    referrer.referredUsers.push(referredUserId);
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

const removeReferralCode = async (userId) => {
  try {
    await ReferralCode.deleteOne({ userId });
    logger.info(`Referral code removed for user ${userId}`);
  } catch (err) {
    logger.error("referralServices/removeReferralCode:", err);
    throw new Error("Failed to remove referral code");
  }
};

const cleanupReferralAssociations = async (userId) => {
  try {
    const usedCode = await ReferralCode.findOne({ referredUsers: userId });

    if (usedCode) {
      usedCode.usageCount -= 1;
      usedCode.referredUsers = usedCode.referredUsers.filter(
        (id) => id.toString() !== userId.toString()
      );
      await usedCode.save();
      logger.info(`Referral usage by ${userId} reversed`);
    }
  } catch (err) {
    logger.error("referralServices/cleanupReferralAssociations:", err);
    throw new Error("Failed to reverse referral association");
  }
};

module.exports = {
  createReferralCode,
  findReferralCodeByUserId,
  processReferral,
  processReversal,
  removeReferralCode,
  cleanupReferralAssociations,
};
