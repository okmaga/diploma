import { createAction, createSlice } from "@reduxjs/toolkit";
import userService from "../services/user.service";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import history from "../utils/history";
import configFile from "../config.json";

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
    },
    usersReceived: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
    },
    userDeleteRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    userDeleted: (state, action) => {
      state.entities = state.entities.filter(u => u._id !== action.payload);
      state.isLoading = false;
    },
    userDeleteFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    userUpdated: (state, action) => {
      const updatedUserIndex = state.entities.findIndex(u => u._id === action.payload._id);
      state.entities[updatedUserIndex] = action.payload;
    },
    authRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authRequestSuccess: (state, action) => {
      state.auth = action.payload;
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
  }
});

const usersRequestFailed = createAction("users/requestFailed");
const userUpdateRequested = createAction("users/updateRequested");
const userUpdateFailed = createAction("users/updateFailed");

const { reducer: usersReducer, actions } = usersSlice;

const {
  usersRequested,
  usersReceived,
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
    dispatch(usersRequestFailed(error.message));
  };
};

export const login = ({ email, password }) => async (dispatch) => {
  dispatch(authRequested());
  try {
    const data = await authService.login({ email, password });
    localStorageService.setTokens(data);
    dispatch(authRequestSuccess({ userId: data.localId }));
  } catch (error) {
    dispatch(authRequestFailed(error.message));
  };
};

export const logout = () => (dispatch) => {
  localStorageService.removeAuthData();
  dispatch(userLoggedOut());
  history.push("/");
};

// TODO – method signUp to be implemented
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
        const errorObject = { email: "User with such email already exists!" };
        dispatch(userCreateFailed(errorObject));
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
    const { content } = await userService.remove(id);
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
    const { content } = await userService.update(payload);
    dispatch(userUpdated(content));
  } catch (error) {
    dispatch(userUpdateFailed(error.message));
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
