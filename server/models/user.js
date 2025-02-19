const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  magicLinkToken: { type: String },
  magicLinkTokenExpires: { type: Date },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
