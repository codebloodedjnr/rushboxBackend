require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const SECRET = process.env.SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
const CLIENTID = process.env.CLIENTID;
const CLIENTSECRET = process.env.CLIENTSECRET;
const CLIENTPASSWORD = process.env.CLIENTPASSWORD;
const TERMII_API_KEY = process.env.TERMII_API_KEY;
const TERMII_SECRET_KEY = process.env.TERMII_SECRET_KEY;
const TERMII_BASE_URL = process.env.TERMII_BASE_URL;
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID;

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  CLIENTSECRET,
  CLIENTID,
  CLIENTPASSWORD,
  TERMII_API_KEY,
  TERMII_SECRET_KEY,
  TERMII_BASE_URL,
  TERMII_SENDER_ID,
};
