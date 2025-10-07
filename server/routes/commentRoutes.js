const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createComment,
  getPostComments,
  deleteComment,
} = require("../controllers/commentController");

router.post("/", authMiddleware, createComment);
router.get("/post/:postId", getPostComments);
router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;
