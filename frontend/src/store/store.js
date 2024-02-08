import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "none",
  userNameForDetails: "",
  usernameExists: false,
  passNotEqual: false,
  hamburger: false,
  isLoggedIn: false,
  reload: false,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    usernameExists(state, action) {
      return { ...state, usernameExists: action.payload };
    },
    setPassNotEqual(state, action) {
      return { ...state, passNotEqual: action.payload };
    },
    hamburgerOptions(state, action) {
      return { ...state, hamburger: action.payload };
    },
    setuserNameForDeatils(state, action) {
      return { ...state, userNameForDetails: action.payload };
    },
    setUsername(state, action) {
      return { ...state, username: action.payload };
    },
    setLoginState(state, action) {
      return { ...state, isLoggedIn: action.payload };
    },
    profileClicked(state, action) {
      return { ...state, reload: action.payload };
    },
  },
});

const store = configureStore({ reducer: blogSlice.reducer });

export const blogActions = blogSlice.actions;

export default store;
