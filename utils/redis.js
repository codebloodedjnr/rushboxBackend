const Redis = require("ioredis");

const redis = new Redis({
    host: "127.0.0.1", // default is localhost
    port: 6379, // default Redis port
    // password: "yourpassword", // if set
});

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (err) => {
    console.error("Redis error:", err);
});

module.exports = redis;