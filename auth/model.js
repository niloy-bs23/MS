const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: ["true", "A user must have a type"],
    },
    type: {
      type: String,
      enum: ["user", "admin"],
      required: ["true", "A user should be anyone of ['user','admin'] "],
    },
    email: {
      type: String,
      required: ["true", "A user must have an email"],
    },
    address: String,
    phone: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
