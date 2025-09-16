const Order = require("../models/ordermodel");
const Estimate = require("../models/estimateresponsemodel");

const logger = require("../utils/logger");

const createOrder = async (orderpayload) => {
  try {
    const order = await Order.create(orderpayload);
    return order;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

const createEstimate = async (name, response) => {
  try {
    const estimate = await Estimate.create({
      name: name,
      response: response,
    });
    return estimate.response;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

module.exports = { createOrder, createEstimate };
