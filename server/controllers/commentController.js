const Comment = require("../models/comment");
const Post = require("../models/post");

// Create a comment
const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const comment = await Comment.create({
      content,
      post: postId,
      author: req.userId,
    });

    // Populate the author details with profile
    await comment.populate({
      path: "author",
      select: "email",
      populate: {
        path: "profile",
        select: "name avatar",
      },
    });

    // Update the post's comments array and commentCount
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
      $inc: { commentCount: 1 },
    });

    // Get post details for notification
    const post = await Post.findById(postId);
    if (post && post.author.toString() !== req.userId) {
      // Create comment notification for post author
      const {
        createCommentNotification,
        createMentionNotifications,
      } = require("../utils/notificationHelper");
      await createCommentNotification(
        req.userId,
        post.author,
        postId,
        post.title
      );

      // Check for mentions in comment content
      await createMentionNotifications(req.userId, content, postId, post.title);
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a post
const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate({
        path: "author",
        select: "email",
        populate: {
          path: "profile",
          select: "name avatar",
        },
      })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is the author of the comment
    if (comment.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Comment.findByIdAndDelete(commentId);

    // Update the post's comments array and commentCount
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
      $inc: { commentCount: -1 },
    });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getPostComments,
  deleteComment,
};
