const Joi = require("joi");

const priceEstimateSchema = Joi.object({
  pickup_location: Joi.string().min(3).max(200).required(),
  delivery_location: Joi.string().min(3).max(200).required(),
  pickup_longitude: Joi.string(),
  pickup_latitude: Joi.string(),
  delivery_longitude: Joi.string(),
  delivery_latitude: Joi.string(),
  delivery_phonenumber: Joi.string()
    .pattern(/^(\+|0)[1-9]\d{1,14}$/)
    .message("Delivery phone number must be in a valid international format")
    .optional(),
  courier_note: Joi.string().max(500).optional(),
});

module.exports = {
  priceEstimateSchema,
};
