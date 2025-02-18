const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinaryConfig");

// Create a new post
router.post("/", upload, async (req, res) => {
  try {
    const { title, content } = req.body;

    let imageUrl = null;
    if (req.file) {
      const base64Image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "posts",
      });

      imageUrl = result.secure_url;
    }

    const newPost = new Post({
      title,
      content,
      image: imageUrl,
    });

    await newPost.save();
    res.status(201).json(newPost);
    console.log("Post created successfully");
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).json({ message: "Error saving post", error: err });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
    console.log("Posts fetched successfully");
  } catch (err) {
    res.status(500).json({ message: "Error fetching post", error });
  }
});

// Get a post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json("Error fetching post", err);
  }
});

// Update a post by ID

router.put("/:id", upload, async (req, res) => {
  try {
    const { title, content } = req.body;
    let imageUrl = req.body.image;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: "posts",
      });
      imageUrl = result.secure_url;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        image: imageUrl,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json("Post not found");
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating post", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json("Post not found");
    }
    res.status(200).json("Post deleted successfully");
  } catch (err) {
    res.status(500).json("Error deleting post", err);
  }
});

module.exports = router;
