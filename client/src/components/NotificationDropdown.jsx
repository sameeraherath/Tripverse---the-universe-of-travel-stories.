import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  fetchUnreadCount,
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
  X,
  Loader2,
} from "lucide-react";

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount, loading } = useSelector(
    (state) => state.notifications
  );
  const currentUser = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      // Fetch unread count initially
      dispatch(fetchUnreadCount());

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    // Fetch notifications when dropdown is opened
    if (isOpen && currentUser) {
      dispatch(fetchNotifications({ page: 1 }));
    }
  }, [isOpen, dispatch, currentUser]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!currentUser) {
    return null;
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "follow":
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case "like":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case "mention":
        return <AtSign className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
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

    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead());
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    await dispatch(deleteNotification(notificationId));
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <Bell
          className="w-6 h-6 text-gray-700"
          style={{
            width: "24px",
            height: "24px",
            color: "#444444",
            display: "block",
          }}
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl border-2 border-gray-200 z-50 max-h-[600px] flex flex-col animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold text-gray-dark">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            <div className="px-4 py-2 border-b border-gray-100">
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔔</div>
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-orange-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          {/* Avatar */}
                          {notification.sender?.profile?.avatar ? (
                            <img
                              src={notification.sender.profile.avatar}
                              alt={notification.sender.profile.name || "User"}
                              className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                              {(notification.sender?.profile?.name ||
                                notification.sender?.email ||
                                "U")[0].toUpperCase()}
                            </div>
                          )}

                          {/* Message */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-dark">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {getTimeAgo(notification.createdAt)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                            )}
                            <button
                              onClick={(e) => handleDelete(e, notification._id)}
                              className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                              aria-label="Delete notification"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate("/notifications");
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
