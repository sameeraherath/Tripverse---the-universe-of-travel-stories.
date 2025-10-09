const Chat = require("../models/chat");
const User = require("../models/user");

// Get all chats for current user
const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.userId,
    })
      .populate({
        path: "participants",
        select: "email",
        populate: {
          path: "profile",
          select: "name avatar",
        },
      })
      .populate({
        path: "messages.sender",
        select: "email",
        populate: {
          path: "profile",
          select: "name avatar",
        },
      })
      .sort({ lastMessageAt: -1 });

    res.status(200).json({ chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Error fetching chats", error });
  }
};

// Get or create chat with specific user
const getOrCreateChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] },
    })
      .populate({
        path: "participants",
        select: "email",
        populate: {
          path: "profile",
          select: "name avatar",
        },
      })
      .populate({
        path: "messages.sender",
        select: "email",
        populate: {
          path: "profile",
          select: "name avatar",
        },
      });

    // Create new chat if doesn't exist
    if (!chat) {
      chat = await Chat.create({
        participants: [currentUserId, userId],
        messages: [],
      });

      chat = await Chat.findById(chat._id)
        .populate({
          path: "participants",
          select: "email",
          populate: {
            path: "profile",
            select: "name avatar",
          },
        })
        .populate({
          path: "messages.sender",
          select: "email",
          populate: {
            path: "profile",
            select: "name avatar",
          },
        });
    }

    res.status(200).json({ chat });
  } catch (error) {
    console.error("Error getting/creating chat:", error);
    res.status(500).json({ message: "Error getting/creating chat", error });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const senderId = req.userId;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is participant
    if (!chat.participants.includes(senderId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Add message
    const message = {
      sender: senderId,
      content,
      read: false,
    };

    chat.messages.push(message);
    chat.lastMessage = content;
    chat.lastMessageAt = new Date();

    await chat.save();

    // Populate message sender details
    await chat.populate({
      path: "messages.sender",
      select: "email",
      populate: {
        path: "profile",
        select: "name avatar",
      },
    });

    const newMessage = chat.messages[chat.messages.length - 1];

    res.status(201).json({ message: newMessage, chatId: chat._id });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message", error });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Mark all unread messages from other user as read
    chat.messages.forEach((message) => {
      if (message.sender.toString() !== userId && !message.read) {
        message.read = true;
      }
    });

    await chat.save();

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Error marking messages as read", error });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;

    const chats = await Chat.find({
      participants: userId,
    });

    let unreadCount = 0;

    chats.forEach((chat) => {
      chat.messages.forEach((message) => {
        if (message.sender.toString() !== userId && !message.read) {
          unreadCount++;
        }
      });
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Error getting unread count", error });
  }
};

// Delete chat
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is participant
    if (!chat.participants.includes(userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ message: "Error deleting chat", error });
  }
};

module.exports = {
  getUserChats,
  getOrCreateChat,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
  deleteChat,
};
