import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user-slice";
import themeSlice from "./theme-slice";
import loadingSlice from "./loading-slice";
import listProfileSlice from "./list-people-slice";
import postSlice from "./posts-slice";
import detailedPostSlice from "./detailed-post-slice";
import collabSlice from "./collab-posts-slice";
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    theme: themeSlice.reducer,
    loading: loadingSlice.reducer,
    profiles: listProfileSlice.reducer,
    posts: postSlice.reducer,
    detailedPost: detailedPostSlice.reducer,
    collabPosts: collabSlice.reducer,
  },
});

export default store;
