const User = require("../models/usermodel");
const logger = require("../utils/logger");

const findUserByOne = async (field, value) => {
  try {
    const query = {};
    query[field] = value;
    const user = await User.findOne(query);
    return user;
  } catch (err) {
    logger.error(err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (err) {
    logger.error(err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    logger.info(`User ${user._id} successfully created`);
    return user;
  } catch (err) {
    logger.error(err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

const updateUserByOne = async (userId) => {
  try {
    const user = await User.updateOne({ _id: userId }, { verified: true });
    logger.info(`User profile successfully updated ${userId}`);
  } catch (err) {
    logger.error(err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

const updateUserPhoneByOne = async (userId) => {
  try {
    const user = await User.updateOne(
      { _id: userId },
      { whatsappverified: true }
    );
    logger.info(`User profile successfully updated ${userId}`);
  } catch (err) {
    logger.error(err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

module.exports = {
  findUserByOne,
  createUser,
  updateUserByOne,
  updateUserPhoneByOne,
  findUserById,
};
