import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../features/notifications/notificationsSlice";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  CheckCheck,
  Trash2,
  Loader2,
} from "lucide-react";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, pagination } = useSelector(
    (state) => state.notifications
  );
  const [filter, setFilter] = useState("all"); // 'all' or 'unread'

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, unreadOnly: filter === "unread" }));
  }, [dispatch, filter]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "follow":
        return (
          <div className="p-3 bg-blue-100 rounded-full">
            <UserPlus className="w-6 h-6 text-blue-500" />
          </div>
        );
      case "like":
        return (
          <div className="p-3 bg-red-100 rounded-full">
            <Heart className="w-6 h-6 text-red-500" />
          </div>
        );
      case "comment":
        return (
          <div className="p-3 bg-green-100 rounded-full">
            <MessageCircle className="w-6 h-6 text-green-500" />
          </div>
        );
      case "mention":
        return (
          <div className="p-3 bg-purple-100 rounded-full">
            <AtSign className="w-6 h-6 text-purple-500" />
          </div>
        );
      default:
        return (
          <div className="p-3 bg-gray-100 rounded-full">
            <Bell className="w-6 h-6 text-gray-500" />
          </div>
        );
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.read) {
      await dispatch(markAsRead(notification._id));
    }

    // Navigate to relevant page
    if (notification.post) {
      navigate(`/post/${notification.post._id}`);
    } else if (notification.type === "follow") {
      navigate(`/profile/${notification.sender._id}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead());
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    await dispatch(deleteNotification(notificationId));
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      dispatch(
        fetchNotifications({
          page: pagination.currentPage + 1,
          unreadOnly: filter === "unread",
        })
      );
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white py-24">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-dark">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-gray-600 mt-1">
                  You have {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "all"
                    ? "bg-gradient-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "unread"
                    ? "bg-gradient-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-white text-orange-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mark All as Read */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-orange-500 text-orange-500 font-medium rounded-xl hover:bg-orange-50 transition-all"
              >
                <CheckCheck className="w-5 h-5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🔔</div>
              <h3 className="text-2xl font-bold text-gray-dark mb-3">
                No notifications yet
              </h3>
              <p className="text-gray-600">
                {filter === "unread"
                  ? "You're all caught up! No unread notifications."
                  : "You'll see notifications here when someone interacts with your content."}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-orange-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          {notification.sender?.profile?.avatar ? (
                            <img
                              src={notification.sender.profile.avatar}
                              alt={notification.sender.profile.name || "User"}
                              className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                              {(notification.sender?.profile?.name?.trim() ||
                                "Anonymous")[0].toUpperCase()}
                            </div>
                          )}

                          {/* Message */}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-dark font-medium">
                              {notification.message}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {getTimeAgo(notification.createdAt)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.read && (
                              <div className="w-3 h-3 bg-orange-500 rounded-full" />
                            )}
                            <button
                              onClick={(e) => handleDelete(e, notification._id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              aria-label="Delete notification"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {pagination.hasMore && (
                <div className="p-6 border-t border-gray-200">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-primary text-white font-semibold rounded-xl border border-gray-200 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
