import { createAction, createSlice } from "@reduxjs/toolkit";
import userService from "../services/user.service";
import localStorageService from "../services/localStorage.service";
import { logout, signUp } from "./authSlice";

const initialState = localStorageService.getAccessToken()
  ? {
    entities: [],
    isLoading: false,
    error: null,
    dataLoaded: false
  } : {
    entities: [],
    isLoading: false,
    error: null,
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
      state.dataLoaded = true;
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
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signUp.fulfilled, (state, action) => {
        const { content } = action.payload;
        if (!Array.isArray(state.entities)) {
          state.entities = [];
        };
        if (state.entities.length) {
          state.entities.push(content);
        };
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.entities = [];
        state.isLoading = false;
        state.error = null;
        state.dataLoaded = false;
      });
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

export const deleteUser = (id) => async (dispatch) => {
  dispatch(userDeleteRequested());
  try {
    const content = await userService.remove(id);
    if (!content) {
      dispatch(userDeleted(id));
    }
  } catch (error) {
    const { code, message } = error.response.data.error;
    if (code === 403) {
      if (message === "NOT_AUTHORIZED_TO_DELETE") {
        const errorObject = { name: "You cannot delete this user" };
        dispatch(userDeleteFailed(errorObject));
        console.log(errorObject);
        throw errorObject;
      };
    };
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

export const getUsers = () => (state) => state.users.entities;

export const getUsersError = () => (state) => state.users.error;
export const getUserById = (id) => (state) => state.users.entities.find(u => u._id === id);

export const getDataStatus = () => (state) => state.users.dataLoaded;
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;

export default usersReducer;
