import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Async thunk to request magic link email
export const sendMagicLink = createAsyncThunk(
  "auth/sendMagicLink",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/send-magic-link", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to verify magic link token
export const verifyMagicLink = createAsyncThunk(
  "auth/verifyMagicLink",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/auth/magic-login/${token}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Helper function to decode token and get userId
const getInitialAuthState = () => {
  const token = localStorage.getItem("authToken");
  let userId = null;

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      userId = decoded.userId;
    } catch {
      // If token is invalid, remove it
      localStorage.removeItem("authToken");
      return { token: null, userId: null };
    }
  }

  return { token, userId };
};

// Auth slice with initial state and reducers
const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...getInitialAuthState(),
    loading: false,
    error: null,
  },
  reducers: {
    // Clear auth state on logout
    logout: (state) => {
      state.token = null;
      state.userId = null;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle magic link request states
      .addCase(sendMagicLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMagicLink.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendMagicLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Handle magic link verification states
      .addCase(verifyMagicLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMagicLink.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = JSON.parse(
          atob(action.payload.token.split(".")[1])
        ).userId;
        localStorage.setItem("authToken", action.payload.token);
      })
      .addCase(verifyMagicLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
