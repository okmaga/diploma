import { createSlice } from "@reduxjs/toolkit";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";

const accessToken = localStorageService.getAccessToken();

const initialState = accessToken
  ? {
    isLoggedIn: true,
    user: null,
    authDataLoading: true,
    error: null
  } : {
    isLoggedIn: false,
    user: null,
    authDataLoading: false,
    error: null
  };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authDataRequested: (state) => {
      state.authDataLoading = true;
    },
    authDataReceived: (state, action) => {
      state.user = action.payload;
      state.authDataLoading = false;
    },
    authDataRequestFailed: (state, action) => {
      state.error = action.payload;
      state.authDataLoading = false;
    }
  }
});

const { reducer: authReducer, actions } = authSlice;

const {
  authDataRequested,
  authDataReceived,
  authDataRequestFailed
} = actions;

export const loadAuthData = () => async (dispatch) => {
  dispatch(authDataRequested());
  try {
    const content = await userService.getCurrentUser();
    dispatch(authDataReceived(content));
  } catch (error) {
    dispatch(authDataRequestFailed(error.message));
  };
};

export const getIsLoggedIn = () => (state) => state.auth.isLoggedIn;

export default authReducer;
