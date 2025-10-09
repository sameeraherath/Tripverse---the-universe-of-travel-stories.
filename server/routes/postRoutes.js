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
router.post(
  "/",
  authMiddleware,
  upload.array("images", 3),
  async (req, res) => {
    try {
      const { title, content, tags } = req.body;
      let imageUrls = [];

      // Upload multiple images to Cloudinary
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) =>
          uploadToCloudinary(file.buffer)
        );
        imageUrls = await Promise.all(uploadPromises);
      }

      // Parse tags if sent as JSON string
      let parsedTags = [];
      if (tags) {
        parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
      }

      const newPost = new Post({
        title,
        content,
        images: imageUrls,
        author: req.userId, // Link post to authenticated user
        tags: parsedTags,
      });

      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating post", error: err.message });
    }
  }
);

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
router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 3),
  async (req, res) => {
    try {
      const { title, content, tags, existingImages } = req.body;
      let imageUrls = [];

      // Parse existing images if provided
      if (existingImages) {
        imageUrls =
          typeof existingImages === "string"
            ? JSON.parse(existingImages)
            : existingImages;
      }

      // Parse tags if sent as JSON string
      let parsedTags = [];
      if (tags) {
        parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
      }

      // Find the post by ID
      const post = await Post.findById(req.params.id);

      // Check if the post exists
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.author.toString() !== req.userId) {
        return res
          .status(403)
          .json({
            message: "Unauthorized: You can only update your own posts",
          });
      }

      // Upload new images to Cloudinary
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) =>
          uploadToCloudinary(file.buffer)
        );
        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Limit to 3 images maximum
      imageUrls = imageUrls.slice(0, 3);

      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          content,
          images: imageUrls,
          tags: parsedTags.length > 0 ? parsedTags : post.tags,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json(updatedPost);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating post", error: err.message });
    }
  }
);

// Get all posts with search and filters
router.get("/", async (req, res) => {
  try {
    const {
      search,
      tags,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build query
    const query = {};

    // Search functionality (text search in title and content)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by tags
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Count total documents
    const total = await Post.countDocuments(query);

    // Build sort object
    const sortOrder = order === "asc" ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    // Fetch posts with pagination
    const posts = await Post.find(query)
      .populate({
        path: "author",
        select: "email",
        populate: {
          path: "profile",
          select: "name avatar bio",
        },
      })
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    res.status(200).json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalPosts: total,
        postsPerPage: parseInt(limit),
        hasMore: parseInt(page) * parseInt(limit) < total,
      },
    });
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
      select: "email",
      populate: {
        path: "profile",
        select: "name avatar bio",
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

      // Create notification for post author (only when liking, not unliking)
      if (post.author.toString() !== req.userId) {
        const {
          createLikeNotification,
        } = require("../utils/notificationHelper");
        await createLikeNotification(
          req.userId,
          post.author,
          post._id,
          post.title
        );
      }
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

// Bookmark a post
router.post("/:id/bookmark", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const Profile = require("../models/profile");
    const profile = await Profile.findOne({ user: req.userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Check if already bookmarked
    const alreadyBookmarked = post.bookmarks.includes(req.userId);

    if (alreadyBookmarked) {
      return res.status(400).json({ message: "Post already bookmarked" });
    }

    // Add bookmark
    post.bookmarks.push(req.userId);
    post.bookmarkCount = post.bookmarkCount + 1;
    profile.bookmarkedPosts.push(post._id);

    await Promise.all([post.save(), profile.save()]);

    res.status(200).json({
      bookmarked: true,
      bookmarkCount: post.bookmarkCount,
      message: "Post bookmarked successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error bookmarking post", error: err.message });
  }
});

// Remove bookmark from a post
router.delete("/:id/bookmark", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const Profile = require("../models/profile");
    const profile = await Profile.findOne({ user: req.userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Check if bookmarked
    const isBookmarked = post.bookmarks.includes(req.userId);

    if (!isBookmarked) {
      return res.status(400).json({ message: "Post not bookmarked" });
    }

    // Remove bookmark
    post.bookmarks = post.bookmarks.filter(
      (id) => id.toString() !== req.userId
    );
    post.bookmarkCount = Math.max(0, post.bookmarkCount - 1);
    profile.bookmarkedPosts = profile.bookmarkedPosts.filter(
      (id) => id.toString() !== post._id.toString()
    );

    await Promise.all([post.save(), profile.save()]);

    res.status(200).json({
      bookmarked: false,
      bookmarkCount: post.bookmarkCount,
      message: "Bookmark removed successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing bookmark", error: err.message });
  }
});

// Get personalized recommendations for authenticated user
router.get("/recommendations", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const Profile = require("../models/profile");

    // Get user's profile with following and bookmarked posts
    const profile = await Profile.findOne({ user: req.userId })
      .populate("bookmarkedPosts", "tags")
      .lean();

    if (!profile) {
      // If no profile, return trending posts
      const trendingPosts = await Post.find()
        .populate({
          path: "author",
          select: "email",
          populate: {
            path: "profile",
            select: "name avatar bio",
          },
        })
        .sort({ likeCount: -1, commentCount: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .lean();

      return res.status(200).json({
        posts: trendingPosts,
        pagination: {
          currentPage: parseInt(page),
          hasMore: trendingPosts.length === parseInt(limit),
        },
      });
    }

    // Extract tags from bookmarked posts
    const bookmarkedTags = profile.bookmarkedPosts
      ? profile.bookmarkedPosts.flatMap((post) => post.tags || [])
      : [];
    const uniqueTags = [...new Set(bookmarkedTags)];

    // Get posts the user has already liked
    const likedPosts = await Post.find({ likes: req.userId }).select("_id");
    const likedPostIds = likedPosts.map((p) => p._id);

    // Build recommendation query
    const query = {
      _id: {
        $nin: [...likedPostIds, ...profile.bookmarkedPosts.map((p) => p._id)],
      }, // Exclude already interacted posts
      $or: [
        // Posts from followed users
        { author: { $in: profile.following || [] } },
        // Posts with similar tags
        { tags: { $in: uniqueTags } },
        // Trending posts (high engagement)
        { $and: [{ likeCount: { $gte: 5 } }, { commentCount: { $gte: 2 } }] },
      ],
    };

    // Count total recommendations
    const total = await Post.countDocuments(query);

    // Fetch recommended posts with scoring
    const recommendedPosts = await Post.find(query)
      .populate({
        path: "author",
        select: "email",
        populate: {
          path: "profile",
          select: "name avatar bio",
        },
      })
      .sort({
        likeCount: -1,
        commentCount: -1,
        createdAt: -1,
      })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    res.status(200).json({
      posts: recommendedPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalPosts: total,
        hasMore: parseInt(page) * parseInt(limit) < total,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching recommendations",
      error: err.message,
    });
  }
});

// Get all unique tags
router.get("/tags/all", async (req, res) => {
  try {
    const tags = await Post.distinct("tags");
    // Filter out empty strings and sort alphabetically
    const filteredTags = tags.filter((tag) => tag && tag.trim()).sort();
    res.status(200).json({ tags: filteredTags });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tags", error: err.message });
  }
});

// Get popular tags (tags with most posts)
router.get("/tags/popular", async (req, res) => {
  try {
    const result = await Post.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    const popularTags = result.map((item) => ({
      tag: item._id,
      count: item.count,
    }));

    res.status(200).json({ tags: popularTags });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching popular tags", error: err.message });
  }
});

module.exports = router;
