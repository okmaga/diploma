import { createAction, createSlice } from "@reduxjs/toolkit";
import purchaseOrdersService from "../services/purchase.order.service";

const initialState = {
  entities: [],
  isLoading: true
};

const purchaseOrdersSlice = createSlice({
  name: "purchaseOrders",
  initialState,
  reducers: {
    purchaseOrdersRequested(state) {
      state.isLoading = true;
    },
    purchaseOrdersReceived(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    }
  }
});

const purchaseOrdersRequestFailed = createAction("purchaseOrders/requestFailed");

const { reducer: purchaseOrdersReducer, actions } = purchaseOrdersSlice;

const { purchaseOrdersRequested, purchaseOrdersReceived } = actions;

export const loadPurchaseOrdersList = () => async (dispatch) => {
  dispatch(purchaseOrdersRequested());
  try {
    const content = await purchaseOrdersService.fetchAll();
    dispatch(purchaseOrdersReceived(content));
  } catch (error) {
    dispatch(purchaseOrdersRequestFailed(error.message));
  };
};

export const getPurchaseOrdersList = () => (state) => state.purchaseOrders.entities;
export const getPurchaseOrdersLoadingStatus = () => (state) => state.purchaseOrders.isLoading;
export default purchaseOrdersReducer;
