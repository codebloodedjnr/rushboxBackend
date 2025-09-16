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
const priceestimateapi = require("../libs/utils/apis/priceestimateapi");

const getestimate = async (req, res, next) => {
  const promises = priceestimateapi.map((api, index) =>
    (async () => {
      try {
        const response = await axios({
          method: api.method,
          url: api.url,
          headers: api.headers,
          data: api.data,
          timeout: 5000,
        });

        // Save raw JSON
        const saved = await deliveryservice.createEstimate(api.name, response);

        // Stream to frontend
        res.write(
          `data: ${JSON.stringify({ index, api: api.name, data: saved })}\n\n`
        );
      } catch (err) {
        res.write(`event: price\n`);
        res.write(
          `data: ${JSON.stringify({ index, api: api.name, error: true })}\n\n`
        );
      }
    })()
  );
};

module.exports = { getestimate };
