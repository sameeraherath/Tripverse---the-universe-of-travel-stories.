import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Get all chats
export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/chats");
      return response.data.chats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chats"
      );
    }
  }
);

// Get or create chat with user
export const getOrCreateChat = createAsyncThunk(
  "chat/getOrCreateChat",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/chats/user/${userId}`);
      return response.data.chat;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get chat"
      );
    }
  }
);

// Send message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/chats/${chatId}/message`, {
        content,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

// Mark messages as read
export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async (chatId, { rejectWithValue }) => {
    try {
      await api.put(`/api/chats/${chatId}/read`);
      return chatId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark messages as read"
      );
    }
  }
);

// Get unread count
export const fetchUnreadCount = createAsyncThunk(
  "chat/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/chats/unread-count");
      return response.data.unreadCount;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

// Delete chat
export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/chats/${chatId}`);
      return chatId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete chat"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChat: null,
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find((c) => c._id === chatId);
      if (chat) {
        chat.messages.push(message);
        chat.lastMessage = message.content;
        chat.lastMessageAt = message.createdAt;
      }
    },
    clearChatState: (state) => {
      state.chats = [];
      state.activeChat = null;
      state.unreadCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chats
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get or create chat
      .addCase(getOrCreateChat.fulfilled, (state, action) => {
        const existingChat = state.chats.find(
          (c) => c._id === action.payload._id
        );
        if (!existingChat) {
          state.chats.unshift(action.payload);
        }
        state.activeChat = action.payload;
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, message } = action.payload;
        const chat = state.chats.find((c) => c._id === chatId);
        if (chat) {
          chat.messages.push(message);
          chat.lastMessage = message.content;
          chat.lastMessageAt = message.createdAt;
        }
        if (state.activeChat?._id === chatId) {
          state.activeChat.messages.push(message);
        }
      })
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // Delete chat
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter((c) => c._id !== action.payload);
        if (state.activeChat?._id === action.payload) {
          state.activeChat = null;
        }
      });
  },
});

export const { setActiveChat, addMessage, clearChatState } = chatSlice.actions;
export default chatSlice.reducer;
