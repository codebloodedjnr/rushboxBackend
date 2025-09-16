const express = require("express");
const validate = require("../utils/validate");
const deliverySchema = require("../schema/deliveryschema");
const deliverycontroller = require("../controllers/deliverycontroller");
const deliveryrouter = express.Router();
const usermiddleware = require("../middlewares/middleware");
const deliverymiddleware = require("../middlewares/deliverymiddleware");

deliveryrouter.post(
  "/",
  validate(deliverySchema.priceEstimateSchema, "body"),
  usermiddleware.verifyToken,
  deliverymiddleware.createOrder,
  deliverycontroller.getestimate
);

deliveryrouter.get("/", (req, res) => {
  res.send({ message: "Welcome" });
});

module.exports = deliveryrouter;
