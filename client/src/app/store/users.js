import { createAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/user.service";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import history from "../utils/history";
import configFile from "../config.json";

export const signUp2 = createAsyncThunk(
  "auth/signUp2",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.register(payload);
      console.log(data);
      if (!data) {
        throw new Error("Server error. Try again later");
      }
      return data;
    } catch (error) {
      const { code, message } = error.response.data.error;
      if (code === 400) {
        if (message === "EMAIL_EXISTS") {
          const errorObject = { email: "User with such email already exists!" };
          dispatch(userCreateFailed(errorObject));
          return rejectWithValue(errorObject);
        };
      };
      return rejectWithValue();
    };
  }
);

const initialState = localStorageService.getAccessToken()
  ? {
    entities: [],
    isLoading: false,
    error: null,
    auth: { userId: localStorageService.getUserId() },
    isLoggedIn: false,
    dataLoaded: false
  } : {
    entities: [],
    isLoading: false,
    error: null,
    auth: null,
    isLoggedIn: false,
    dataLoaded: false
  };

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    usersRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    usersReceived: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
    },
    usersRequestFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    userDeleteRequested: (state) => {
      state.error = null;
    },
    userDeleted: (state, action) => {
      state.entities = state.entities.filter(u => u._id !== action.payload);
    },
    userDeleteFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    userUpdated: (state, action) => {
      const updatedUserIndex = state.entities.findIndex(u => u._id === action.payload._id);
      state.entities[updatedUserIndex] = action.payload;
      state.isLoading = false;
    },
    authRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authRequestSuccess: (state, action) => {
      state.auth = action.payload;
      state.isLoggedIn = true;
      state.isLoading = true;
    },
    authRequestFailed: (state, action) => {
      state.error = action.payload;
    },
    userCreateRequested: (state) => {
      state.isLoading = true;
    },
    userCreated: (state, action) => {
      if (!Array.isArray(state.entities)) {
        state.entities = [];
      };
      state.entities.push(action.payload);
      state.isLoading = false;
    },
    userCreateFailed: (state, action) => {
      state.error = action.payload;
    },
    userLoggedOut: (state) => {
      state.auth = null;
      state.isLoggedIn = false;
    }
  },
  extraReducers: {
    [signUp2.pending]: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    [signUp2.fulfilled]: (state, action) => {
      if (!Array.isArray(state.entities)) {
        state.entities = [];
      };
      state.entities.push(action.payload);
      state.isLoading = false;
      state.isLoading = false;
    },
    [signUp2.rejected]: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

const userUpdateRequested = createAction("users/updateRequested");
const userUpdateFailed = createAction("users/updateFailed");

const { reducer: usersReducer, actions } = usersSlice;

const {
  usersRequested,
  usersReceived,
  usersRequestFailed,
  userUpdated,
  authRequested,
  authRequestSuccess,
  authRequestFailed,
  userCreateRequested,
  userCreated,
  userCreateFailed,
  userLoggedOut,
  userDeleteRequested,
  userDeleted,
  userDeleteFailed
} = actions;

export const loadUsersList = () => async (dispatch) => {
  dispatch(usersRequested());
  try {
    const content = await userService.fetchAll();
    dispatch(usersReceived(content));
  } catch (error) {
    const { code, message } = error.response.data.error;
    if (code === 401) {
      if (message === "NOT_AUTHORIZED") {
        const errorObject = { auth: "Please log in or contact your administrator" };
        dispatch(usersRequestFailed(errorObject));
      };
    };
  };
};

export const login = ({ email, password }) => async (dispatch) => {
  dispatch(authRequested());
  try {
    const data = await authService.login({ email, password });
    data.localId = data.userId;
    data.idToken = data.accessToken;
    localStorageService.setTokens(data);
    dispatch(authRequestSuccess({ userId: data.localId }));
    await dispatch(loadUsersList());
  } catch (error) {
    dispatch(authRequestFailed(error.message));
    const { code, message } = error.response.data.error;
    if (code === 400) {
      switch (message) {
      case "INVALID_PASSWORD":
        throw new Error("Email or password are incorrect");
      case "EMAIL_NOT_FOUND":
        throw new Error("Email or password are incorrect");
      default:
        throw new Error("Too many log in attempts. Try again later.");
      };
    };
  };
};

export const logout = () => (dispatch) => {
  localStorageService.removeAuthData();
  dispatch(userLoggedOut());
  history.push("/");
};

export const signUp = (payload) => async (dispatch) => {
  dispatch(userCreateRequested());
  try {
    const data = await authService.register(payload);
    if (payload.logMeIn) {
      dispatch(login(payload));
    };
    if (configFile.isFireBase) {
      dispatch(createUserFirebase({ ...payload, _id: data.localId }));
    } else {
      dispatch(userCreated(data));
    };
  } catch (error) {
    const { code, message } = error.response.data.error;
    if (code === 400) {
      if (message === "EMAIL_EXISTS") {
        const errorObject = { email: "User with such email already exists" };
        dispatch(userCreateFailed(errorObject));
        throw errorObject;
      };
    };
  };
};

function createUserFirebase(payload) {
  return async function (dispatch) {
    dispatch(userCreateRequested());
    try {
      const { content } = await userService.create(payload);
      dispatch(userCreated(content));
      history.push("/users");
    } catch (error) {
      dispatch(userCreateFailed(error.message));
    }
  };
};
export const deleteUser = (id) => async (dispatch) => {
  dispatch(userDeleteRequested());
  try {
    const content = await userService.remove(id);
    if (!content) {
      dispatch(userDeleted(id));
    }
  } catch (error) {
    dispatch(userDeleteFailed(error.response));
  }
};

export const updateUser = (payload) => async (dispatch) => {
  dispatch(userUpdateRequested());
  try {
    const data = await userService.update(payload);
    dispatch(userUpdated(data));
  } catch (error) {
    const { code, message } = error.response.data.error;
    if (code === 400) {
      if (message === "EMAIL_ASSIGNED_TO_ANOTHER_USER") {
        const errorObject = { email: "This email is already in use" };
        dispatch(userUpdateFailed(errorObject));
        throw errorObject;
      };
    };
    if (code === 401) {
      if (message === "NOT_AUTHORIZED") {
        const errorObject = { name: "Cannot edit this user" };
        dispatch(userUpdateFailed(errorObject));
        throw errorObject;
      };
    };
  };
};

export const getCurrentUserData = () => (state) => {
  return state.users.entities
    ? state.users.entities.find(u => u._id === state.users.auth.userId)
    : null;
};
export const getUsers = () => (state) => state.users.entities;

export const getUsersError = () => (state) => state.users.error;
export const getUserById = (id) => (state) => state.users.entities.find(u => u._id === id);
export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;

export default usersReducer;
