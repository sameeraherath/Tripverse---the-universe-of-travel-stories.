const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getUserChats,
  getOrCreateChat,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
  deleteChat,
} = require("../controllers/chatController");

// All routes require authentication
router.use(authMiddleware);

// Get all chats
router.get("/", getUserChats);

// Get unread message count
router.get("/unread-count", getUnreadCount);

// Get or create chat with user
router.get("/user/:userId", getOrCreateChat);

// Send message
router.post("/:chatId/message", sendMessage);

// Mark messages as read
router.put("/:chatId/read", markMessagesAsRead);

// Delete chat
router.delete("/:chatId", deleteChat);

module.exports = router;
