const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  //More input needed like name and all
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, default: null },
  phonenumber: { type: String, default: null },
  verified: { type: Boolean, default: false },
  phoneverified: { type: Boolean, default: false },
  profilePicture: { type: String },
});

UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("User", UserSchema);
