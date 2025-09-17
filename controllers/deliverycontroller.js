require("express-async-errors");
const axios = require("axios");
const otpServices = require("../services/otpservice");
const emailServices = require("../services/emailservice");
const userServices = require("../services/userservice");
const logger = require("../utils/logger");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const deliveryservice = require("../services/deliveryservice");
const smsServices = require("../services/smsservices");
const redisService = require("../services/rediservice");
const Orderpayload = require("../libs/utils/payload/orderpayload");
const { apis } = require("../libs/utils/apis/priceestimateapi");

const getestimate = async (req, res, next) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  console.log('==> getestimate called for user:', req.userId);

  try {
    // Run APIs in parallel
    const promises = apis(req).map(async (api, index) => {
      console.log(`==> Calling API: ${api.name}`);

      try {
        const response = await axios({
          method: api.method,
          url: api.url,
          headers: api.headers,
          data: api.data,
          timeout: 5000,
        });

        console.log(`==> API ${api.name} responded`);

        // Save raw JSON
        const saved = await deliveryservice.createEstimate(
          req.userId,
          api.name,
          response.data // careful: use response.data not the whole object
        );

        // Stream to frontend
        res.write(
          `data: ${JSON.stringify({ index, api: api.name, data: saved })}\n\n`
        );
      } catch (err) {
        console.error(`Error calling ${api.name}:`, err.message);

        res.write(`event: price\n`);
        res.write(
          `data: ${JSON.stringify({ index, api: api.name, error: true })}\n\n`
        );
      }
    });

    // Wait for all to finish
    await Promise.all(promises);

    // End the stream
    res.end();
    console.log('==> Finished streaming estimates');
  } catch (err) {
    next(err);
  }
};

module.exports = { getestimate };
