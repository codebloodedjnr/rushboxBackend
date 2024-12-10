const express = require("express");
const validate = require("../utils/validate");
const schema = require("../schema/validationschema");
const userController = require("../controllers/usercontroller");
const userrouter = express.Router();
const middleware = require("../utils/middleware");
// const upload = require("../utils/cloudinary");

// userrouter.post(
//   "/feedback",
//   validate(schema.contactSchema, "body"),
//   userController.contact
// );

userrouter.post(
  "/signup",
  validate(schema.signupSchema, "body"),
  userController.signup
);

userrouter.post(
  "/verifyOTP",
  validate(schema.verifyOTPSchema, "body"),
  userController.verify
);

userrouter.post(
  "/resendOTP",
  validate(schema.resendOTPSchema),
  userController.resendOTPCode
);

userrouter.post("/login", validate(schema.loginSchema), userController.login);

userrouter.post(
  "/VerifyOTPLogin",
  validate(schema.verifyOTPSchema, "body"),
  userController.verifyOtpLogin
);

userrouter.get(
  "/personalinfo",
  middleware.verifyToken,
  userController.personalinfo
);

// userrouter.post(
//   "/uploadProfilePicture",
//   middleware.verifyToken,
//   upload.single("profilePicture"),
//   userController.profilePicture
// );

// userrouter.delete(
//   "/profilePicture",
//   middleware.verifyToken,
//   userController.profilePictureDelete
// );

userrouter.post(
  "/personalinfo/update",
  validate(schema.personalInfoSchema),
  middleware.verifyToken,
  userController.updatepersonalinfo
);

userrouter.post(
  "/personalinfo/changeemail",
  validate(schema.changeemailSchema),
  middleware.verifyToken,
  userController.changeemail
);

// userrouter.post(
//   "/personalinfo/changephonenumber",
//   validate(schema.changePhonenumberSchema),
//   middleware.verifyToken,
//   whatsappController.changephonenumber
// );

userrouter.post(
  "/personalinfo/changeemail/verify",
  validate(schema.verifynewmail),
  middleware.verifyToken,
  userController.verifynewmail
);

// userrouter.post(
//   "/personalinfo/changephonenumber/verify",
//   validate(schema.changeVerifySchema),
//   middleware.verifyToken,
//   whatsappController.changephonenumberverify
// );

// userrouter.post("/logout", middleware.verifyToken, userController.logout);

module.exports = userrouter;
