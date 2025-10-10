import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Login user
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

// Register user
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/register", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
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
      localStorage.removeItem("authToken");
      return { token: null, userId: null };
    }
  }

  return { token, userId };
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...getInitialAuthState(),
    userRole: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.userRole = null;
      localStorage.removeItem("authToken");
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.userRole = action.payload.role;
        localStorage.setItem("authToken", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        localStorage.setItem("authToken", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      });
  },
});

export const { logout, setUserRole } = authSlice.actions;
export default authSlice.reducer;
