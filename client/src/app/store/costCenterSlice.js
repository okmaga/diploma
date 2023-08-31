import { createAction, createSlice } from "@reduxjs/toolkit";
import costCenterService from "../services/costCenter.service";
import { logout } from "./authSlice";

const initialState = {
  entities: [],
  isLoading: false,
  error: null
};

const costCenterSlice = createSlice({
  name: "costCenter",
  initialState,
  reducers: {
    costCenterRequested(state) {
      state.isLoading = true;
    },
    costCenterReceived(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.error = null;
        state.entities = [];
      });
  }
});

const costCenterRequestFailed = createAction("costCenter/requestFailed");

const { reducer: costCenterReducer, actions } = costCenterSlice;

const { costCenterRequested, costCenterReceived } = actions;

export const loadCostCenterList = () => async (dispatch) => {
  dispatch(costCenterRequested());
  try {
    const content = await costCenterService.fetchAll();
    dispatch(costCenterReceived(content));
  } catch (error) {
    dispatch(costCenterRequestFailed(error.message));
  };
};

export const getCostCenterList = () => (state) => state.costCenter.entities;
export const getCostCenterById = (id) => (state) => state.costCenter.entities.find(cc => cc._id === id);
export const getCostCenterByTitle = (title) => (state) => state.costCenter.entities.find(cc => cc.title === title);

export const getCostCenterError = () => (state) => state.costCenter.error;
export const getCostCenterLoadingStatus = () => (state) => state.costCenter.isLoading;
export default costCenterReducer;
