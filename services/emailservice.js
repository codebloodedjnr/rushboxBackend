const logger = require("../utils/logger");
const nodemailer = require("nodemailer");
const config = require("../utils/config");

// Send Emails
const sendEmail = async (
  userEmail,
  subject = "Verify your OTP",
  htmltext = ""
) => {
  try {
    const mailOptions = {
      from: config.EMAIL_USER,
      to: userEmail,
      subject: subject,
      html: htmltext,
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
    });

    await transporter.sendMail(mailOptions);
    logger.info("Email successfully sent");
  } catch (err) {
    logger.error("Error in sending mail:", err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    throw error;
  }
};

// <img src="" alt="RushBox logo" style="width: 43px; height: 36px; display: inline;">

// Function to send OTP email
const sendOtpEmail = async (user_email, otp) => {
  try {
    const subject = "Verify Your Email";
    const html = `
      <div style="background-color: #f0f0f0; padding: 20px; max-width: 640px; margin: auto;">
        <section style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="display: block;">
            
            <h1 style="color: #086D00; display: inline;">Rushbox</h1>
          </div>
          <h3>Email Verification</h3>
          <p>Your verification code is: <b>${otp}</b>. Do not share this code with anybody to ensure the safety of your account. OTP expires in 10 minutes.</p>
          <p>Ignore this message if you have already been verified.</p>
        </section>
      </div>`;

    // Pass the HTML content as the third argument
    await sendEmail(user_email, subject, html);
  } catch (err) {
    logger.error("Error in sendOtpEmail:", err.message);
    throw err;
  }
};

module.exports = {
  sendOtpEmail,
  sendEmail,
};
