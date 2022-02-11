import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userObj: {},
    token: "",
  },
  reducers: {
    signUp(state, action) {
      const newUser = action.payload.user;
      const newToken = action.payload.token;

      state.userObj = newUser;
      state.token = newToken;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;
