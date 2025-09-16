const logger = require("../utils/logger");
const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const userServices = require("../services/userservice");
const deliveryServices = require("../services/deliveryservice");
const redisService = require("../services/rediservice");

const createOrder = async (req, res, next) => {
  const order = deliveryServices.createOrder(req.body);
  if (!order) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
  req.order = order;
  next();
};

module.exports = { createOrder };
