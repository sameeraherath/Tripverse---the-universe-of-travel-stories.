const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, default: "", trim: true },
    bio: { type: String, default: "", trim: true },
    avatar: { type: String, default: "" },
    magicLinkToken: { type: String, index: true },
    magicLinkTokenExpires: { type: Date, index: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
