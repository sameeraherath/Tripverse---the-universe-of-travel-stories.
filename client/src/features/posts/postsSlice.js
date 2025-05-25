import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all posts from the API
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`);
  return response.data;
});

// Create a new post with image support
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Like a post
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { getState }) => {
    const { auth } = getState();
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/posts/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    return { postId, ...response.data };
  }
);

// Posts slice definition
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [], // Array to store all posts
    loading: false, // Loading state for API calls
    error: null, // Store any error messages
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch posts states
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle create post states
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Handle like post states
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.postId);
        if (post) {
          post.likeCount = action.payload.likeCount;
          post.liked = action.payload.liked;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
