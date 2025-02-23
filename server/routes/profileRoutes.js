const express = require("express");
const router = express.Router();
const User = require("../models/user");
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinaryConfig");
const authMiddleware = require("../middleware/authMiddleware");
const { Readable } = require("stream");

// Get profile details
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-magicLinkToken -magicLinkTokenExpires"
    );
    res.status(200).json(user);
    console.log("User fetched successfully:", user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error });
  }
});

// Update profile details
router.put("/", authMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    const { name, bio } = req.body;
    let avatarUrl = req.body.avatar;

    if (req.file) {
      console.log("Buffer exists:", req.file.buffer); // Log the buffer content

      if (!req.file.buffer || req.file.buffer.length === 0) {
        return res
          .status(400)
          .json({ message: "File buffer is empty or invalid." });
      }

      // Convert the buffer to a readable stream
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null); // Signal the end of the stream

      // Log the timestamp being used for the signature
      const timestamp = Math.floor(Date.now() / 1000);
      console.log("Timestamp used for signature:", timestamp);

      // Upload the stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "avatars", resource_type: "auto" },
        (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error);
            return res.status(500).json({
              message: "Error uploading avatar",
              error: error.message,
            });
          }

          avatarUrl = result.secure_url; // Get the URL of the uploaded image

          // Update the user with the new avatar URL
          User.findByIdAndUpdate(
            req.userId,
            { name, bio, avatar: avatarUrl },
            { new: true, runValidators: true }
          )
            .then((updatedUser) => {
              res.status(200).json(updatedUser);
            })
            .catch((updateError) => {
              res.status(500).json({
                message: "Error updating profile",
                error: updateError.message,
              });
            });
        }
      );

      // Pipe the buffer stream to the Cloudinary upload stream
      bufferStream.pipe(uploadStream);
    } else {
      // If no file is uploaded, just update the name and bio
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { name, bio },
        { new: true, runValidators: true }
      );
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

module.exports = router;
