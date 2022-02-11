import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    isLoading: false,
    showSpinner: true,
    message: "",
    color: "green",
    forwardTo: "",
  },
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload.isLoading;
      state.message = action.payload.message;
      state.color = action.payload.color;
      state.showSpinner = action.payload.showSpinner;
      state.forwardTo = action.payload.forwardTo;
    },
  },
});

export const loadingActions = loadingSlice.actions;
export default loadingSlice;
