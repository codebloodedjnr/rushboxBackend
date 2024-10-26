const axios = require("axios");
const config = require("../utils/config");
const logger = require("../utils/logger");

// Function to send SMS
const sendSMS = async (phoneNumber, message) => {
  try {
    const payload = {
      to: phoneNumber,
      from: config.TERMII_SENDER_ID,
      sms: message,
      type: "plain",
      api_key: config.TERMII_API_KEY,
      channel: "generic",
      secret_key: config.TERMII_SECRET_KEY,
    };

    const response = await axios.post(
      `${config.TERMII_BASE_URL}/api/sms/send`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.message === "Successfully Sent") {
      logger.info("SMS successfully sent");
      console.log(message);
    } else {
      logger.error("Failed to send SMS:", response.data);
      throw new Error(
        `SMS failed to send: ${response.data.message || "Unknown error"}`
      );
    }
  } catch (err) {
    logger.error("Error in sendSMS:", err.message);
    if (err.response) {
      logger.error("SMS API responded with status:", err.response.status);
      logger.error("SMS API response data:", err.response.data);
    }
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

// Function to send OTP via SMS
const sendOtpSMS = async (phoneNumber, otp) => {
  const message = `Your Rushbox confirmation code is ${otp}. It expires in 30 minutes.`;
  await sendSMS(phoneNumber, message);
};

module.exports = {
  sendSMS,
  sendOtpSMS,
};
