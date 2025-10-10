const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    role: { 
      type: String, 
      enum: ['user', 'admin', 'superadmin'], 
      default: 'user' 
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
