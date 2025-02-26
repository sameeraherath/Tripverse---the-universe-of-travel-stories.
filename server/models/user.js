const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    magicLinkToken: { type: String, index: true },
    magicLinkTokenExpires: { type: Date, index: true },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
