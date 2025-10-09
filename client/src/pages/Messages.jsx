import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchChats,
  getOrCreateChat,
  sendMessage,
  markMessagesAsRead,
  setActiveChat,
  addMessage,
} from "../features/chat/chatSlice";
import { useSocket } from "../contexts/SocketContext";
import { MessageCircle, Send, Search, ArrowLeft, Loader2 } from "lucide-react";

const Messages = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { chats, activeChat, loading } = useSelector((state) => state.chat);
  const currentUserId = useSelector((state) => state.auth.userId);
  const { socket, onlineUsers } = useSocket();

  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    dispatch(fetchChats());

    const userId = searchParams.get("userId");
    if (userId) {
      dispatch(getOrCreateChat(userId));
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !activeChat) return;

    // Join chat room
    socket.emit("chat:join", activeChat._id);

    // Listen for new messages
    const handleReceiveMessage = ({ chatId, message }) => {
      if (chatId === activeChat._id) {
        dispatch(addMessage({ chatId, message }));
        dispatch(markMessagesAsRead(chatId));
      }
    };

    // Listen for typing indicators
    const handleTypingStart = ({ chatId, userId }) => {
      if (chatId === activeChat._id && userId !== currentUserId) {
        setTypingUsers((prev) => new Set([...prev, userId]));
      }
    };

    const handleTypingStop = ({ chatId, userId }) => {
      if (chatId === activeChat._id) {
        setTypingUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(userId);
          return updated;
        });
      }
    };

    socket.on("message:receive", handleReceiveMessage);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.emit("chat:leave", activeChat._id);
      socket.off("message:receive", handleReceiveMessage);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [socket, activeChat, dispatch, currentUserId]);

  // Mark messages as read when opening chat
  useEffect(() => {
    if (activeChat) {
      dispatch(markMessagesAsRead(activeChat._id));
    }
  }, [activeChat, dispatch]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    const content = messageInput.trim();
    setMessageInput("");

    // Send typing stop event
    if (socket) {
      socket.emit("typing:stop", {
        chatId: activeChat._id,
        userId: currentUserId,
      });
    }

    // Send message
    const result = await dispatch(
      sendMessage({ chatId: activeChat._id, content })
    );

    if (sendMessage.fulfilled.match(result)) {
      // Emit message through socket
      if (socket) {
        socket.emit("message:send", {
          chatId: activeChat._id,
          message: result.payload.message,
        });
      }
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    // Handle typing indicator
    if (!isTyping && socket && activeChat) {
      setIsTyping(true);
      socket.emit("typing:start", {
        chatId: activeChat._id,
        userId: currentUserId,
      });
    }

    // Clear typing indicator after 2 seconds of inactivity
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      if (socket && activeChat) {
        socket.emit("typing:stop", {
          chatId: activeChat._id,
          userId: currentUserId,
        });
        setIsTyping(false);
      }
    }, 2000);
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(
      (p) => p._id.toString() !== currentUserId.toString()
    );
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const filteredChats = chats.filter((chat) => {
    const otherUser = getOtherParticipant(chat);
    const name = otherUser?.profile?.name || otherUser?.email || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-[calc(100vh-140px)] flex">
          {/* Sidebar - Chat List */}
          <div
            className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${
              activeChat ? "hidden md:flex" : ""
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Messages
              </h1>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {loading && chats.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Start a conversation from a user&apos;s profile
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredChats.map((chat) => {
                    const otherUser = getOtherParticipant(chat);
                    const isOnline = isUserOnline(otherUser?._id);
                    const unreadCount = chat.messages.filter(
                      (m) => m.sender._id !== currentUserId && !m.read
                    ).length;

                    return (
                      <div
                        key={chat._id}
                        onClick={() => dispatch(setActiveChat(chat))}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          activeChat?._id === chat._id ? "bg-orange-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            {otherUser?.profile?.avatar ? (
                              <img
                                src={otherUser.profile.avatar}
                                alt={otherUser.profile.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                                {(otherUser?.profile?.name ||
                                  otherUser?.email ||
                                  "U")[0].toUpperCase()}
                              </div>
                            )}
                            {isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-800 truncate">
                                {otherUser?.profile?.name ||
                                  otherUser?.email ||
                                  "Unknown User"}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatTime(chat.lastMessageAt)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate">
                                {chat.lastMessage || "No messages yet"}
                              </p>
                              {unreadCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs font-semibold rounded-full">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div
            className={`flex-1 flex flex-col ${
              !activeChat ? "hidden md:flex" : ""
            }`}
          >
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => dispatch(setActiveChat(null))}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    {(() => {
                      const otherUser = getOtherParticipant(activeChat);
                      const isOnline = isUserOnline(otherUser?._id);

                      return (
                        <>
                          <div className="relative">
                            {otherUser?.profile?.avatar ? (
                              <img
                                src={otherUser.profile.avatar}
                                alt={otherUser.profile.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                                {(otherUser?.profile?.name ||
                                  otherUser?.email ||
                                  "U")[0].toUpperCase()}
                              </div>
                            )}
                            {isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                            )}
                          </div>

                          <div>
                            <h2 className="font-semibold text-gray-800">
                              {otherUser?.profile?.name ||
                                otherUser?.email ||
                                "Unknown User"}
                            </h2>
                            <p className="text-sm text-gray-500">
                              {isOnline ? "Online" : "Offline"}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {activeChat.messages.map((message, index) => {
                    const isOwnMessage = message.sender._id === currentUserId;
                    const showAvatar =
                      index === 0 ||
                      activeChat.messages[index - 1].sender._id !==
                        message.sender._id;

                    return (
                      <div
                        key={message._id || index}
                        className={`flex gap-3 ${
                          isOwnMessage ? "flex-row-reverse" : ""
                        }`}
                      >
                        {/* Avatar */}
                        {showAvatar ? (
                          <div className="flex-shrink-0">
                            {message.sender.profile?.avatar ? (
                              <img
                                src={message.sender.profile.avatar}
                                alt={message.sender.profile.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                                {(message.sender.profile?.name ||
                                  message.sender.email ||
                                  "U")[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-8" />
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`max-w-[70%] ${
                            isOwnMessage ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="break-words">{message.content}</p>
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {typingUsers.size > 0 && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs">...</span>
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-6 border-t border-gray-200"
                >
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={handleInputChange}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="px-6 py-3 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <MessageCircle className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Select a conversation
                  </h2>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
