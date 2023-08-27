import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import purchaseOrdersService from "../services/purchase.order.service";
import { logout } from "./authSlice";

const initialState = {
  entities: [],
  isLoading: true,
  error: null
};

export const approvePurchaseOrder = createAsyncThunk(
  "purchaseOrders/approve",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const result = await purchaseOrdersService.bulkApprove(payload);
      if (result.acknowledged) {
        return payload;
      };
    } catch (error) {
      const { code, message } = error.response.data.error;
      if (code === 401) {
        switch (message) {
        case "NOT_AUTHORIZED":
          return rejectWithValue("Not authorized to do this");
        default:
          return rejectWithValue("Something went wrong. Try again later");
        };
      };
      if (code === 500) {
        return rejectWithValue("Server error. Try again later.");
      };
    }
  }
);

export const cancelPurchaseOrder = createAsyncThunk(
  "purchaseOrders/cancel",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const result = await purchaseOrdersService.bulkCancel(payload);
      if (result.acknowledged) {
        return payload;
      };
    } catch (error) {
      const { code, message } = error.response.data.error;
      if (code === 401) {
        switch (message) {
        case "NOT_AUTHORIZED":
          return rejectWithValue("Not authorized to do this");
        default:
          return rejectWithValue("Something went wrong. Try again later");
        };
      };
      if (code === 500) {
        return rejectWithValue("Server error. Try again later.");
      };
    }
  }
);

const purchaseOrdersSlice = createSlice({
  name: "purchaseOrders",
  initialState,
  reducers: {
    purchaseOrdersRequested(state) {
      state.isLoading = true;
      state.error = null;
    },
    purchaseOrdersReceived(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(approvePurchaseOrder.pending, (state) => {
        state.error = null;
      })

      .addCase(approvePurchaseOrder.fulfilled, (state, action) => {
        action.payload.forEach(po => {
          const index = state.entities.findIndex(storePo => {
            return storePo._id === po._id;
          });
          state.entities[index].status = "Approved";
        });
        state.isLoading = false;
        state.error = null;
      })

      .addCase(approvePurchaseOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(cancelPurchaseOrder.pending, (state) => {
        state.error = null;
      })

      .addCase(cancelPurchaseOrder.fulfilled, (state, action) => {
        action.payload.forEach(po => {
          const index = state.entities.findIndex(storePo => {
            return storePo._id === po._id;
          });
          state.entities[index].status = "Cancelled";
        });
        state.isLoading = false;
        state.error = null;
      })

      .addCase(cancelPurchaseOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(logout.fulfilled, (state) => {
        state.error = null;
      }

      );
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

export const getPurchaseOrderError = () => (state) => state.purchaseOrders.error;
export const getPurchaseOrdersLoadingStatus = () => (state) => state.purchaseOrders.isLoading;
export default purchaseOrdersReducer;
