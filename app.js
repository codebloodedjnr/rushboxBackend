const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./utils/config");
const logger = require("./utils/logger");
const userRoutes = require("./routers/userrouters");
const middleware = require("./utils/middleware");

const app = express();

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI, {})
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// Middleware setup
app.use(cors());
app.use(express.static("dist"));
app.use(express.json()); // Built-in body parser for JSON
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", userRoutes);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

// Export the app for use in index.js or server.js
module.exports = app;
