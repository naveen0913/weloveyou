import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
  userId: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.role = null;
      state.userId = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
    },
    checkAuthStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    checkAuthSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
    },    
    checkAuthFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.userId = action.payload.id;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.userId = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  checkAuthStart,
  checkAuthSuccess,
  checkAuthFailure,
  setUser,
  clearUser
} = authSlice.actions;

export default authSlice.reducer;
