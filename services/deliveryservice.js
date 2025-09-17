const Order = require("../models/ordermodel");
const Estimate = require("../models/estimateresponsemodel");

const logger = require("../utils/logger");

const createOrder = async (orderpayload, userId) => {
  try {
    const payload = {
      userId: userId,
      deliveryId: null,
      pickup_location: orderpayload.pickup_location,
      delivery_location: orderpayload.delivery_location,
      pickup_longitude: orderpayload.pickup_longitude,
      pickup_latitude: orderpayload.pickup_latitude,
      delivery_longitude: orderpayload.delivery_longitude,
      delivery_latitude: orderpayload.delivery_latitude,
      delivery_phonenumber: orderpayload.delivery_phonenumber,
      courier_note: orderpayload.courier_note,
    };

    const order = await Order.create(payload);
    return order;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

const createEstimate = async (userId, name, response) => {
  try {
    const estimate = await Estimate.create({
      userId,
      name,
      response,
    });
    return estimate.response;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

module.exports = { createOrder, createEstimate };
