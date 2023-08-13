import { createAction, createSlice } from "@reduxjs/toolkit";
import userService from "../services/user.service";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import history from "../utils/history";

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
    userDeleted: (state, action) => {
      state.entities = state.entities.filter(u => u.id !== action.payload);
    },
    userUpdated: (state, action) => {
      const updatedUserIndex = state.entities.findIndex(u => u.id === action.payload.id);
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
    userCreated: (state, action) => {
      if (!Array.isArray(state.entities)) {
        state.entities = [];
      };
      state.entities.push(action.payload);
    },
    userLoggedOut: (state) => {
      state.auth = null;
      state.isLoggedIn = false;
    }
  }
});

const usersRequestFailed = createAction("users/requestFailed");
const userDeleteRequested = createAction("users/deleteRequested");
const userDeleteFailed = createAction("users/deleteFailed");
const userCreateRequested = createAction("users/createRequested");
const userCreateFailed = createAction("users/createFailed");
const userUpdateRequested = createAction("users/updateRequested");
const userUpdateFailed = createAction("users/updateFailed");

const { reducer: usersReducer, actions } = usersSlice;

const {
  usersRequested,
  usersReceived,
  userDeleted,
  userUpdated,
  authRequested,
  authRequestSuccess,
  authRequestFailed,
  userCreated,
  userLoggedOut
} = actions;

export const loadUsersList = () => async (dispatch) => {
  dispatch(usersRequested());
  try {
    const { content } = await userService.fetchAll();
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
export const signUp = ({ email, password, ...rest }) => async (dispatch) => {
  dispatch(authRequested());
  try {
    const data = await authService.register({ email, password });
    localStorageService.setTokens(data);
    dispatch(authRequestSuccess({ userId: data.localId }));
    dispatch(createUser({ email, id: data.localId, ...rest }));
  } catch (error) {
    dispatch(authRequestFailed(error.message));
  };
};

function createUser(payload) {
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
    const { content } = await userService.delete(id);
    if (content === null) {
      dispatch(userDeleted(id));
    }
  } catch (error) {
    dispatch(userDeleteFailed(error.message));
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
    ? state.users.entities.find(u => u.id === state.users.auth.userId)
    : null;
};
export const getUsers = () => (state) => state.users.entities;
export const getUserById = (id) => (state) => state.users.entities.find(u => u.id === id);
export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;

export default usersReducer;
