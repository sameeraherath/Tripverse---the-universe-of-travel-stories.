import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Create comment
export const createComment = createAsyncThunk(
  "comments/create",
  async ({ content, postId }, thunkAPI) => {
    try {
      const response = await api.post("/api/comments", { content, postId });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Get comments for a post
export const getPostComments = createAsyncThunk(
  "comments/getPostComments",
  async (postId, thunkAPI) => {
    try {
      const response = await api.get(`/api/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (commentId, thunkAPI) => {
    try {
      await api.delete(`/api/comments/${commentId}`);
      return commentId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments.unshift(action.payload);
        state.error = null;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getPostComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
        state.error = null;
      })
      .addCase(getPostComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
