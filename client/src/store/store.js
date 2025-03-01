// Redux store configuration - combines all reducers
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postReducer from "../features/posts/postsSlice";
import profileReducer from "../features/profile/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    profile: profileReducer,
  },
});

export default store;
