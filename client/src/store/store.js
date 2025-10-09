// Redux store configuration - combines all reducers
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postReducer from "../features/posts/postsSlice";
import profileReducer from "../features/profile/profileSlice";
import commentsReducer from "../features/comments/commentsSlice";
import followingReducer from "../features/following/followingSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    profile: profileReducer,
    comments: commentsReducer,
    following: followingReducer,
    notifications: notificationsReducer,
  },
});

export default store;
