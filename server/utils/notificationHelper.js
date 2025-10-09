const Notification = require("../models/notification");

/**
 * Creates a notification in the database
 * @param {Object} params - Notification parameters
 * @param {String} params.recipientId - User ID of the notification recipient
 * @param {String} params.senderId - User ID of the notification sender
 * @param {String} params.type - Type of notification (follow, like, comment, mention)
 * @param {String} params.message - Notification message
 * @param {String} params.postId - Optional post ID
 * @param {String} params.commentId - Optional comment ID
 */
const createNotification = async ({
  recipientId,
  senderId,
  type,
  message,
  postId = null,
  commentId = null,
}) => {
  try {
    // Don't create notification if sender and recipient are the same
    if (recipientId.toString() === senderId.toString()) {
      return null;
    }

    // Check if similar notification already exists (to prevent duplicates)
    const existingNotification = await Notification.findOne({
      recipient: recipientId,
      sender: senderId,
      type,
      post: postId,
      comment: commentId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Within last 24 hours
    });

    if (existingNotification) {
      // Update the existing notification instead of creating a new one
      existingNotification.message = message;
      existingNotification.read = false;
      existingNotification.createdAt = new Date();
      await existingNotification.save();
      return existingNotification;
    }

    // Create new notification
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      message,
      post: postId,
      comment: commentId,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

/**
 * Creates a follow notification
 */
const createFollowNotification = async (followerId, followedUserId) => {
  const Profile = require("../models/profile");

  try {
    const followerProfile = await Profile.findOne({ user: followerId });
    const followerName = followerProfile?.name || "Someone";

    return await createNotification({
      recipientId: followedUserId,
      senderId: followerId,
      type: "follow",
      message: `${followerName} started following you`,
    });
  } catch (error) {
    console.error("Error creating follow notification:", error);
  }
};

/**
 * Creates a like notification
 */
const createLikeNotification = async (
  likerId,
  postAuthorId,
  postId,
  postTitle
) => {
  const Profile = require("../models/profile");

  try {
    const likerProfile = await Profile.findOne({ user: likerId });
    const likerName = likerProfile?.name || "Someone";

    return await createNotification({
      recipientId: postAuthorId,
      senderId: likerId,
      type: "like",
      message: `${likerName} liked your post "${postTitle.substring(0, 30)}${
        postTitle.length > 30 ? "..." : ""
      }"`,
      postId,
    });
  } catch (error) {
    console.error("Error creating like notification:", error);
  }
};

/**
 * Creates a comment notification
 */
const createCommentNotification = async (
  commenterId,
  postAuthorId,
  postId,
  postTitle
) => {
  const Profile = require("../models/profile");

  try {
    const commenterProfile = await Profile.findOne({ user: commenterId });
    const commenterName = commenterProfile?.name || "Someone";

    return await createNotification({
      recipientId: postAuthorId,
      senderId: commenterId,
      type: "comment",
      message: `${commenterName} commented on your post "${postTitle.substring(
        0,
        30
      )}${postTitle.length > 30 ? "..." : ""}"`,
      postId,
    });
  } catch (error) {
    console.error("Error creating comment notification:", error);
  }
};

/**
 * Creates mention notifications for all mentioned users in content
 */
const createMentionNotifications = async (
  senderId,
  content,
  postId,
  postTitle
) => {
  const Profile = require("../models/profile");
  const User = require("../models/user");

  try {
    // Extract mentions from content (e.g., @username)
    const mentionRegex = /@(\w+)/g;
    const mentions = [...content.matchAll(mentionRegex)];

    if (mentions.length === 0) return;

    const senderProfile = await Profile.findOne({ user: senderId });
    const senderName = senderProfile?.name || "Someone";

    // Get unique usernames
    const usernames = [...new Set(mentions.map((m) => m[1]))];

    // Find users by name (assuming username is the profile name)
    const profiles = await Profile.find({
      name: { $in: usernames },
    }).populate("user");

    // Create notifications for each mentioned user
    const notificationPromises = profiles.map((profile) =>
      createNotification({
        recipientId: profile.user._id,
        senderId,
        type: "mention",
        message: `${senderName} mentioned you in "${postTitle.substring(
          0,
          30
        )}${postTitle.length > 30 ? "..." : ""}"`,
        postId,
      })
    );

    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Error creating mention notifications:", error);
  }
};

module.exports = {
  createNotification,
  createFollowNotification,
  createLikeNotification,
  createCommentNotification,
  createMentionNotifications,
};
