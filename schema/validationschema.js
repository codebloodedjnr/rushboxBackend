const Joi = require("joi");

const signupSchema = Joi.object({
  email: Joi.string().email().default("null"),
  phonenumber: Joi.string()
    .pattern(/^(\+|0)[1-9]\d{1,14}$/)
    .message({
      "string.pattern.base":
        "Phone number must be a valid international format",
    })
    .default("null"),
});

const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().max(6).required().messages({
    "any.only": "Invalid OTP",
  }),
});

const resendOTPSchema = Joi.object({
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().default("null"),
  phonenumber: Joi.string()
    .pattern(/^(\+|0)[1-9]\d{1,14}$/)
    .message({
      "string.pattern.base":
        "Phone number must be a valid international format",
    })
    .default("null"),
});

const personalInfoSchema = Joi.object({
  firstname: Joi.string().min(3).max(50).required(),
  lastname: Joi.string().min(3).required(),
});

const changeemailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verifynewmail = Joi.object({
  otp: Joi.string().max(6).required().messages({
    "any.only": "Invalid OTP",
  }),
});

module.exports = {
  signupSchema,
  verifyOTPSchema,
  resendOTPSchema,
  loginSchema,
  personalInfoSchema,
  changeemailSchema,
  verifynewmail,
};