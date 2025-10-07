import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Fetch all posts with search, pagination, and sorting
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({
    search = "",
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page);
    params.append("limit", limit);
    params.append("sortBy", sortBy);
    params.append("order", order);

    const response = await api.get(`/api/posts?${params.toString()}`);
    return response.data;
  }
);

// Create a new post with image support
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Like a post
export const likePost = createAsyncThunk("posts/likePost", async (postId) => {
  const response = await api.post(`/api/posts/${postId}/like`);
  return { postId, ...response.data };
});

// Bookmark a post
export const bookmarkPost = createAsyncThunk(
  "posts/bookmarkPost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/posts/${postId}/bookmark`);
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to bookmark post"
      );
    }
  }
);

// Remove bookmark from a post
export const removeBookmark = createAsyncThunk(
  "posts/removeBookmark",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/posts/${postId}/bookmark`);
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove bookmark"
      );
    }
  }
);

// Get bookmarked posts
export const getBookmarkedPosts = createAsyncThunk(
  "posts/getBookmarkedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/profile/bookmarks");
      return response.data.bookmarks;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookmarks"
      );
    }
  }
);

// Posts slice definition
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [], // Array to store all posts
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalPosts: 0,
      hasMore: false,
    },
    loading: false, // Loading state for API calls
    error: null, // Store any error messages
    searchTerm: "",
    sortBy: "createdAt",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetch posts states
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const newPosts = action.payload.posts || action.payload;
        const newPagination = action.payload.pagination;

        // If it's page 1 or a new search, replace posts; otherwise append
        if (newPagination && newPagination.currentPage === 1) {
          state.posts = newPosts;
        } else if (newPagination && newPagination.currentPage > 1) {
          state.posts = [...state.posts, ...newPosts];
        } else {
          state.posts = newPosts;
        }

        state.pagination = newPagination || state.pagination;
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
      })
      // Handle bookmark post states
      .addCase(bookmarkPost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.postId);
        if (post) {
          post.bookmarkCount = action.payload.bookmarkCount;
          post.bookmarked = action.payload.bookmarked;
        }
      })
      .addCase(bookmarkPost.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Handle remove bookmark states
      .addCase(removeBookmark.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.postId);
        if (post) {
          post.bookmarkCount = action.payload.bookmarkCount;
          post.bookmarked = action.payload.bookmarked;
        }
      })
      .addCase(removeBookmark.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Handle get bookmarked posts states
      .addCase(getBookmarkedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookmarkedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getBookmarkedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, setSortBy } = postsSlice.actions;
export default postsSlice.reducer;
