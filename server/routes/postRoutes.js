const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
    console.log("Post saved successfully");
  } catch (err) {
    res.status(500).json("Error saving post", err);
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
    console.log("Posts fetched successfully");
  } catch (err) {
    res.status(500).json("Error fetching posts", err);
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

router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPost) {
      return res.status(404).json("Post not found");
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json("Error updating post", err);
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
