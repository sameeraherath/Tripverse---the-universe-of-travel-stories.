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

// Get profile details by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
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

// Follow a user
router.post("/follow/:userId", authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.userId;

    // Prevent following yourself
    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Get both profiles
    const [currentUserProfile, targetUserProfile] = await Promise.all([
      Profile.findOne({ user: currentUserId }),
      Profile.findOne({ user: targetUserId }),
    ]);

    if (!targetUserProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    if (currentUserProfile.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add to following and followers arrays
    await Promise.all([
      Profile.findOneAndUpdate(
        { user: currentUserId },
        {
          $push: { following: targetUserId },
          $inc: { followingCount: 1 },
        }
      ),
      Profile.findOneAndUpdate(
        { user: targetUserId },
        {
          $push: { followers: currentUserId },
          $inc: { followerCount: 1 },
        }
      ),
    ]);

    // Create notification for the followed user
    const { createFollowNotification } = require("../utils/notificationHelper");
    await createFollowNotification(currentUserId, targetUserId);

    res.status(200).json({ message: "Successfully followed user" });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Error following user", error });
  }
});

// Unfollow a user
router.delete("/follow/:userId", authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.userId;

    // Get both profiles
    const [currentUserProfile, targetUserProfile] = await Promise.all([
      Profile.findOne({ user: currentUserId }),
      Profile.findOne({ user: targetUserId }),
    ]);

    if (!targetUserProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if not following
    if (!currentUserProfile.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    // Remove from following and followers arrays
    await Promise.all([
      Profile.findOneAndUpdate(
        { user: currentUserId },
        {
          $pull: { following: targetUserId },
          $inc: { followingCount: -1 },
        }
      ),
      Profile.findOneAndUpdate(
        { user: targetUserId },
        {
          $pull: { followers: currentUserId },
          $inc: { followerCount: -1 },
        }
      ),
    ]);

    res.status(200).json({ message: "Successfully unfollowed user" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ message: "Error unfollowing user", error });
  }
});

// Get followers list
router.get("/followers/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      {
        path: "followers",
        populate: {
          path: "profile",
          select: "name avatar bio",
        },
        select: "email",
      }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      followers: profile.followers,
      count: profile.followerCount,
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ message: "Error fetching followers", error });
  }
});

// Get following list
router.get("/following/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      {
        path: "following",
        populate: {
          path: "profile",
          select: "name avatar bio",
        },
        select: "email",
      }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      following: profile.following,
      count: profile.followingCount,
    });
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).json({ message: "Error fetching following", error });
  }
});

// Check if current user is following another user
router.get("/follow/status/:userId", authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.userId;

    const currentUserProfile = await Profile.findOne({ user: currentUserId });

    if (!currentUserProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const isFollowing = currentUserProfile.following.includes(targetUserId);

    res.status(200).json({ isFollowing });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ message: "Error checking follow status", error });
  }
});

// Get bookmarked posts
router.get("/bookmarks", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userId }).populate({
      path: "bookmarkedPosts",
      populate: {
        path: "author",
        select: "email",
        populate: {
          path: "profile",
          select: "name avatar bio",
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      bookmarks: profile.bookmarkedPosts,
      count: profile.bookmarkedPosts.length,
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Error fetching bookmarks", error });
  }
});

// Check if a post is bookmarked
router.get("/bookmark/status/:postId", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId;
    const profile = await Profile.findOne({ user: req.userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const isBookmarked = profile.bookmarkedPosts.some(
      (id) => id.toString() === postId
    );

    res.status(200).json({ isBookmarked });
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    res.status(500).json({ message: "Error checking bookmark status", error });
  }
});

module.exports = router;
