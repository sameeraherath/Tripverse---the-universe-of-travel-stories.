import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Follow a user
export const followUser = createAsyncThunk(
  "following/followUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/profile/follow/${userId}`);
      return { userId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to follow user"
      );
    }
  }
);

// Unfollow a user
export const unfollowUser = createAsyncThunk(
  "following/unfollowUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/profile/follow/${userId}`);
      return { userId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unfollow user"
      );
    }
  }
);

// Check follow status
export const checkFollowStatus = createAsyncThunk(
  "following/checkFollowStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/profile/follow/status/${userId}`);
      return { userId, isFollowing: response.data.isFollowing };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check follow status"
      );
    }
  }
);

// Get followers list
export const getFollowers = createAsyncThunk(
  "following/getFollowers",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/profile/followers/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch followers"
      );
    }
  }
);

// Get following list
export const getFollowing = createAsyncThunk(
  "following/getFollowing",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/profile/following/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch following"
      );
    }
  }
);

const followingSlice = createSlice({
  name: "following",
  initialState: {
    followStatus: {}, // { userId: true/false }
    followers: [],
    following: [],
    followerCount: 0,
    followingCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearFollowingState: (state) => {
      state.followStatus = {};
      state.followers = [];
      state.following = [];
      state.followerCount = 0;
      state.followingCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Follow user
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.followStatus[action.payload.userId] = true;
        state.followingCount += 1;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Unfollow user
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.followStatus[action.payload.userId] = false;
        state.followingCount = Math.max(0, state.followingCount - 1);
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check follow status
      .addCase(checkFollowStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkFollowStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.followStatus[action.payload.userId] = action.payload.isFollowing;
      })
      .addCase(checkFollowStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get followers
      .addCase(getFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.followers;
        state.followerCount = action.payload.count;
      })
      .addCase(getFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get following
      .addCase(getFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload.following;
        state.followingCount = action.payload.count;
      })
      .addCase(getFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFollowingState } = followingSlice.actions;
export default followingSlice.reducer;
