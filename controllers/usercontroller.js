require("express-async-errors");
const otpServices = require("../services/otpservice");
const emailServices = require("../services/emailservice");
const userServices = require("../services/userservice");
const logger = require("../utils/logger");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
// const cloudinary = require("cloudinary").v2;

// const contact = async (req, res, next) => {
//   const { firstname, lastname, email, phonenumber, content } = req.body;
//   try {
//     let emailbody = "Firstname: " + firstname + "\n";
//     emailbody = emailbody + "Lastname: " + lastname + "\n";
//     emailbody = emailbody + "Phone Number: " + phonenumber + "\n";
//     emailbody = emailbody + "Email: " + email + "\n";
//     emailbody = emailbody + "\n" + content;
//     await emailServices.sendEmail(
//       "infodiarydove@gmail.com",
//       (subject = "Customer's FeedBack"),
//       (reminderText = emailbody),
//       (htmltext = "")
//     );
//     return res.status(200).json({
//       status: "success",
//       message: "Feedback successfully logged",
//     });
//   } catch (err) {
//     logger.error("Customers Feedback:", err);
//     next(err);
//   }
// };

// Signup New User

const signup = async (req, res, next) => {
  const { email, phonenumber } = req.body;
  try {
    let user = await userServices.findUserByOne("email", email);
    if (user !== null && user.email !== null) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    user = await userServices.findUserByOne("phonenumber", phonenumber);

    if (user !== null && user.phonenumber !== null) {
      return res.status(400).json({
        status: "error",
        message: "Phonenumber is already taken",
      });
    }

    user = await userServices.createUser({
      email,
      phonenumber,
    });
    await otpServices.deleteUserOtpsByUserId(user._id);
    const otp = await otpServices.createUserOtp(user._id);
    await emailServices.sendOtpEmail(email, otp);
    console.log(otp);
    res.status(200).json({
      status: "PENDING",
      message: "Verification OTP sent",
      data: { email },
    });
  } catch (err) {
    logger.error("Authentication/Signup:", err);
    next(err);
  }
};

// Verify OTP
const verify = async (req, res, next) => {
  try {
    let { phonenumber, email, otp } = req.body;

    // Check if either email or phone number is provided
    if (!email && !phonenumber) {
      return res.status(400).json({
        status: "error",
        message: "Please provide either email or phone number",
      });
    }

    let user;
    // Check by email if provided
    if (email) {
      user = await userServices.findUserByOne("email", email);
    }

    // Check by phone number if provided and no email was provided
    if (phonenumber && !user) {
      user = await userServices.findUserByOne("phonenumber", phonenumber);
    }

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User does not exist, please re-route to sign-up page",
      });
    }

    const userotprecord = await otpServices.findUserOtpByUserId(user._id);

    if (!userotprecord) {
      return res.status(404).json({
        status: "error",
        message: "User has already been verified, please log in",
      });
    }

    const hashedotp = userotprecord.otp;
    const expiresat = userotprecord.expiresat;

    if (expiresat < Date.now()) {
      await otpServices.deleteUserOtpsByUserId(user._id);
      return res.status(404).json({
        status: "error",
        message: "OTP has expired",
      });
    }

    const validotp = await bcrypt.compare(otp, hashedotp);
    if (!validotp) {
      return res.status(404).json({
        status: "error",
        message: "Invalid OTP",
      });
    }

    // OTP is valid, update user verification status and delete OTP record
    await userServices.updateUserByOne(user._id);
    await otpServices.deleteUserOtpsByUserId(user._id); // Ensure OTP record is deleted

    logger.info(`Verification successful for ${email ? email : phonenumber}`);
    return res.status(200).json({
      status: "success",
      message: `${email ? "Email" : "Phone number"} verified successfully`,
    });
  } catch (err) {
    logger.error("Authentication/Verify:", err);
    next(err);
  }
};

// Resend OTP
const resendOTPCode = async (req, res, next) => {
  try {
    let { email, phonenumber } = req.body;

    // Check if either email or phone number is provided
    if (!email && !phonenumber) {
      return res.status(400).json({
        status: "error",
        message: "Please provide either email or phone number",
      });
    }

    let user;

    // Check by email if provided
    if (email) {
      user = await userServices.findUserByOne("email", email);
    }

    // Check by phone number if provided and no email was provided
    if (phonenumber && !user) {
      user = await userServices.findUserByOne("phonenumber", phonenumber);
    }

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User has no records",
      });
    }

    // Delete existing OTPs associated with the user
    await otpServices.deleteUserOtpsByUserId(user._id);

    // Generate a new OTP
    let otp = await otpServices.createUserOtp(user._id);

    // Send the OTP based on whether it's an email or phone number
    if (email) {
      await emailServices.sendOtpEmail(user.email, otp);
      logger.info(`OTP sent to email: ${user.email}`);
    }
    //  else if (phonenumber) {
    //   await smsServices.sendOtpSms(user.phonenumber, otp); // Assuming you have an SMS service
    //   logger.info(`OTP sent to phone number: ${user.phonenumber}`);
    // }

    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
      data: { contact: email ? email : phonenumber },
    });
  } catch (err) {
    logger.error("Authentication/ResendOTP:", err);
    next(err);
  }
};

// Login User
const login = async (req, res, next) => {
  const { phonenumber, email } = req.body;

  try {
    // Ensure either phone number or email is provided
    if (!phonenumber && !email) {
      return res.status(400).json({
        status: "error",
        message: "Please provide either phone number or email",
      });
    }

    let user;
    // Find user by email or phone number
    if (email) {
      user = await userServices.findUserByOne("email", email);
    } else if (phonenumber) {
      user = await userServices.findUserByOne("phonenumber", phonenumber);
    }

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Check if the user is verified
    if (!user.verified) {
      return res.status(400).json({
        status: "error",
        message: "User not verified",
      });
    }

    // Generate and send OTP
    let otp = await otpServices.createUserOtp(user._id);

    if (email) {
      await emailServices.sendOtpEmail(user.email, otp);
      console.log(otp);
      logger.info(`OTP sent to email: ${user.email}`);
    } else if (phonenumber) {
      await smsServices.sendOtpSms(user.phonenumber, otp);
      logger.info(`OTP sent to phone number: ${user.phonenumber}`);
    }

    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
      data: { contact: email ? email : phonenumber },
    });
  } catch (err) {
    logger.error("Authentication/Login:", err);
    next(err);
  }
};

// Verify Login OTP
const verifyOtpLogin = async (req, res, next) => {
  const { phonenumber, email, otp } = req.body;

  try {
    // Ensure either phone number or email is provided
    if (!phonenumber && !email) {
      return res.status(400).json({
        status: "error",
        message: "Please provide either phone number or email",
      });
    }

    let user;
    // Find user by email or phone number
    if (email) {
      user = await userServices.findUserByOne("email", email);
    } else if (phonenumber) {
      user = await userServices.findUserByOne("phonenumber", phonenumber);
    }

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Retrieve the OTP record
    const userOtpRecord = await otpServices.findUserOtpByUserId(user._id);

    if (!userOtpRecord) {
      return res.status(400).json({
        status: "error",
        message: "No OTP found or OTP already used/expired",
      });
    }

    // Check OTP expiration
    if (userOtpRecord.expiresat < Date.now()) {
      await otpServices.deleteUserOtpsByUserId(user._id);
      return res.status(400).json({
        status: "error",
        message: "OTP has expired",
      });
    }

    // Verify OTP
    const validOtp = await bcrypt.compare(otp, userOtpRecord.otp);
    if (!validOtp) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP",
      });
    }

    // OTP is valid, log in the user
    await otpServices.deleteUserOtpsByUserId(user._id); // Clean up OTP after successful verification
    const token = jwt.sign({ userId: user._id }, config.SECRET, {
      expiresIn: "",
    });
    const refreshtoken = jwt.sign({ userId: user._id }, config.SECRET, {
      expiresIn: "",
    });
    // await redisService.setArray(user._id.toString(), [token, refreshtoken]);

    logger.info(`User ${user.firstnam} has been successfully signed in.`);
    return res.status(200).json({
      status: "success",
      message: "User signed in successfully",
      data: [
        { token: token },
        { refreshtoken: refreshtoken },
        { firstname: user.firstname },
        { phonenumber: user.phonenumber },
        { email: user.email },
      ],
    });
  } catch (err) {
    logger.error("Authentication/VerifyOTPLogin:", err);
    next(err);
  }
};

//change personal settings

//Get Users Personalinfo ?? working
const personalinfo = async (req, res) => {
  try {
    const user = await userServices.findUserByOne("_id", req.userId);
    return res.status(200).json({
      status: "success",
      message: "User data successfully retrieved",
      data: [
        { firstname: user.firstname },
        { lastname: user.lastname },
        { email: user.email },
        { phonenumber: user.phonenumber },
        { verified: user.verified },
        { phoneverified: user.phoneverified },
        { profilePicture: user.profilePicture },
      ],
    });
  } catch (err) {
    logger.error("Settings/personalinfo: ", err);
    next(err);
  }
};

// Upoad Profile picture
const profilePicture = async (req, res) => {
  try {
    const user = await userServices.findUserByOne("_id", req.userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    user.profilePicture = req.file.path; // Cloudinary file path
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Profile picture successfully uploaded",
      data: {
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    logger.error("Settings/profilePicture: ", err);
    if (err.status != 500) {
      err.status = 500;
    }
    next(err);
  }
};

// Delete Profile picture
const profilePictureDelete = async (req, res) => {
  try {
    const user = await userServices.findUserByOne("_id", req.userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    if (user.profilePicture) {
      await cloudinary.uploader.destroy(user.profilePicture);
    }
    user.profilePicture = null; // Cloudinary file path
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Profile picture successfully deleted",
      data: {
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    logger.error("Settings/profilePictureDelete: ", err);
    if (err.status != 500) {
      err.status = 500;
    }
    next(err);
  }
};

// Update user personalinfo
const updatepersonalinfo = async (req, res, next) => {
  const { firstname, lastname } = req.body;
  try {
    let user = await userServices.findUserByOne("_id", req.userId);

    // Update user details if provided
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "User details successfully edited",
    });
  } catch (err) {
    logger.error("user/setup: ", err);
    next(err);
  }
};

//change user email
const changeemail = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await userServices.findUserByOne("email", email);
    if (user) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }
    user = await userServices.findUserByOne("_id", req.userId);
    user.verified = false;
    user.email = email;
    await user.save();
    await otpServices.deleteUserOtpsByUserId(user._id);
    let otp = await otpServices.createUserOtp(user._id);
    await emailServices.sendOtpEmail(email, otp);
    return res.status(200).json({
      status: "success",
      message: "OTP successfully sent",
      data: { email },
    });
  } catch (err) {
    logger.error("user/changeemail: ", err);
    next(err);
  }
};

//verify new user email
const verifynewmail = async (req, res) => {
  const { otp } = req.body;
  try {
    const userotprecord = await otpServices.findUserOtpByUserId(req.userId);
    if (!userotprecord) {
      return res.status(404).json({
        status: "error",
        message: "Restricted access to user",
      });
    }
    const hashedotp = userotprecord.otp;
    const expiresat = userotprecord.expiresat;
    if (expiresat < Date.now()) {
      await otpServices.deleteUserOtpsByUserId(req.userId);
      return res.status(404).json({
        status: "error",
        message: "OTP has expired",
      });
    }
    const validotp = await bcrypt.compare(otp, hashedotp);
    if (!validotp) {
      return res.status(404).json({
        status: "error",
        message: "Invalid OTP",
      });
    }
    await userServices.updateUserByOne(req.userId);
    await otpServices.deleteUserOtpsByUserId(req.userId);
    return res.status(200).json({
      status: "success",
      message: "User email verified successfully",
    });
  } catch (err) {
    logger.error("user/changeemail/verify: ", err);
    next(err);
  }
};

const logout = async (req, res) => {
  try {
    await redisService.delArray(req.userId);
    return res.status(200).json({
      status: "success",
      message: "User successfully logged out",
    });
  } catch (err) {
    logger.error("user/logout: ", err);
    next(err);
  }
};

module.exports = {
  signup,
  verify,
  resendOTPCode,
  login,
  verifyOtpLogin,
  logout,
  personalinfo,
  profilePicture,
  profilePictureDelete,
  updatepersonalinfo,
  changeemail,
  verifynewmail,
  //   contact,
};
