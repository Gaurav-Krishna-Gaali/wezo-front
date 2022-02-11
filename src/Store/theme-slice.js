import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    darkMode: true,
  },
  reducers: {
    setTheme(state, action) {
      state.darkMode = action.payload.darkMode;
      localStorage.setItem("darkMode", action.payload.darkMode);
    },
  },
});

export const themeActions = themeSlice.actions;
export default themeSlice;
