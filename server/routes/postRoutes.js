const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinaryConfig");
const authMiddleware = require("../middleware/authMiddleware");

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "posts" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// Create a new post
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const newPost = new Post({
      title,
      content,
      image: imageUrl,
      author: req.userId, // Link post to authenticated user
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating post", error: err.message });
  }
});

// Delete a post by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Find the post by ID
    const post = await Post.findById(req.params.id);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the authenticated user is the author of the post
    if (post.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not the author of this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: err.message });
  }
});

// Update a post by ID
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    let imageUrl = req.body.image;

    // Find the post by ID

    const post = await Post.findById(req.params.id);

    // Check if the post exists

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    if (post.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only update your own posts" });
    }

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, image: imageUrl },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating post", error: err.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name avatar");
    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: err.message });
  }
});

// Get a post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "author",
      select: "email profile",
      populate: {
        path: "profile",
        select: "name avatar",
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching post", error: err.message });
  }
});

// Like a post
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user has already liked the post
    const alreadyLiked = post.likes.includes(req.userId);

    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter((id) => id.toString() !== req.userId);
      post.likeCount = post.likeCount - 1;
    } else {
      // Like the post
      post.likes.push(req.userId);
      post.likeCount = post.likeCount + 1;
    }

    await post.save();
    res.status(200).json({
      liked: !alreadyLiked,
      likeCount: post.likeCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Error liking post", error: err.message });
  }
});

module.exports = router;
