import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAccessToken, setTokens, removeAuthData } from "../services/localStorage.service";
import userService from "../services/user.service";
import authService from "../services/auth.service";

const accessToken = getAccessToken();

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.login({ email, password });
      setTokens({ ...data, localId: data.userId, idToken: data.accessToken });
      const content = await userService.getCurrentUser();
      return content;
    } catch (error) {
      const { code, message } = error.response.data.error;
      if (code === 400) {
        switch (message) {
        case "INVALID_PASSWORD":
          return rejectWithValue("Email or password are incorrect");
        case "EMAIL_NOT_FOUND":
          return rejectWithValue("Email or password are incorrect");
        default:
          return rejectWithValue("Too many log in attempts. Try again later.");
        };
      };
      if (code === 500) {
        return rejectWithValue("Server error. Try again later.");
      };
    };
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.register(payload);
      if (payload.logMeIn) {
        setTokens({ ...data, localId: data.userId, idToken: data.accessToken });
        const content = await userService.getCurrentUser();
        return { content, logMeIn: true };
      };
      return { content: data, logMeIn: false };
    } catch (error) {
      const { code, message } = error.response.data.error;
      if (code === 400) {
        switch (message) {
        case "EMAIL_EXISTS":
          return rejectWithValue("This email is already in use");
        default:
          return rejectWithValue("Something is not right! Try again later");
        };
      };
    };
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await removeAuthData();
});

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
    currentUserDataRequested: (state) => {
      state.authDataLoading = true;
    },
    currentUserDataReceived: (state, action) => {
      state.user = action.payload;
      state.authDataLoading = false;
    },
    currentUserDataRequestFailed: (state, action) => {
      state.error = action.payload;
      state.authDataLoading = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, (state) => {
        state.authDataLoading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authDataLoading = false;
        state.isLoggedIn = true;
        state.error = null;
      })

      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.authDataLoading = false;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.authDataLoading = false;
        state.error = null;
      })

      .addCase(signUp.pending, (state) => {
        state.error = null;
      })

      .addCase(signUp.fulfilled, (state, action) => {
        const { content, logMeIn } = action.payload;

        if (logMeIn) {
          state.user = content;
          state.authDataLoading = false;
          state.isLoggedIn = true;
          state.error = null;
        };
      })

      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload;
        state.authDataLoading = false;
      });
  }
});

const { reducer: authReducer, actions } = authSlice;

const {
  currentUserDataRequested,
  currentUserDataReceived,
  currentUserDataRequestFailed
} = actions;

export const loadCurrentUserData = () => async (dispatch) => {
  dispatch(currentUserDataRequested());
  try {
    const content = await userService.getCurrentUser();
    dispatch(currentUserDataReceived(content));
  } catch (error) {
    dispatch(currentUserDataRequestFailed(error.message));
  };
};

export const getIsLoggedIn = () => (state) => state.auth.isLoggedIn;
export const getIsAdmin = () => (state) => state.auth.user.role === "admin";

export const getAuthDataLoading = () => (state) => state.auth.authDataLoading;

export const getCurrentUser = () => (state) => state.auth.user;

export default authReducer;
