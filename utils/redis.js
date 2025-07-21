const Redis = require("ioredis");
const redis = new Redis(); // You can pass config options here

module.exports = redis;