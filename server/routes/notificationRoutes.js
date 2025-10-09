const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");
const authMiddleware = require("../middleware/authMiddleware");

// Get all notifications for current user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const query = { recipient: req.userId };
    if (unreadOnly === "true") {
      query.read = false;
    }

    const total = await Notification.countDocuments(query);

    const notifications = await Notification.find(query)
      .populate({
        path: "sender",
        select: "email",
        populate: {
          path: "profile",
          select: "name avatar",
        },
      })
      .populate("post", "title")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      recipient: req.userId,
      read: false,
    });

    res.status(200).json({
      notifications,
      unreadCount,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalNotifications: total,
        hasMore: parseInt(page) * parseInt(limit) < total,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error });
  }
});

// Get unread notification count
router.get("/unread-count", authMiddleware, async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipient: req.userId,
      read: false,
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Error fetching unread count", error });
  }
});

// Mark notification as read
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.userId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error updating notification", error });
  }
});

// Mark all notifications as read
router.put("/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.userId, read: false },
      { read: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Error updating notifications", error });
  }
});

// Delete a notification
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.userId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification", error });
  }
});

// Delete all read notifications
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await Notification.deleteMany({
      recipient: req.userId,
      read: true,
    });

    res
      .status(200)
      .json({ message: "Read notifications deleted successfully" });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Error deleting notifications", error });
  }
});

module.exports = router;
