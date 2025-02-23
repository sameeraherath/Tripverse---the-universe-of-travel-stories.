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

// Update a post by ID
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, image: imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

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
    const post = await Post.findById(req.params.id);
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

module.exports = router;
