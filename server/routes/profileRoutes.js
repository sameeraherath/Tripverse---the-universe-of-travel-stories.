const express = require("express");
const router = express.Router();
const Profile = require("../models/profile");
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinaryConfig");
const authMiddleware = require("../middleware/authMiddleware");

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// Get profile details
router.get("/", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userId }).populate(
      "user",
      "email"
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
});

// Update profile details
router.put("/", authMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    const { name, bio } = req.body;
    let avatarUrl = req.body.avatar;

    if (req.file) {
      // Upload the avatar to Cloudinary
      avatarUrl = await uploadToCloudinary(req.file.buffer, "avatars");
    }

    // Update the profile
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.userId },
      { name, bio, avatar: avatarUrl },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
});

module.exports = router;
