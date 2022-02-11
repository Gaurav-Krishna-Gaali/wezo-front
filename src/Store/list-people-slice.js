import { createSlice } from "@reduxjs/toolkit";

const listProfileSlice = createSlice({
  name: "listProfile",
  initialState: {
    list: [],
  },
  reducers: {
    addToList(state, action) {
      const newList = action.payload.list;

      state.list = [...state.list, ...newList];
    },
    reset(state, action) {
      state.list = [];
    },
  },
});

export const listProfileActions = listProfileSlice.actions;
export default listProfileSlice;
