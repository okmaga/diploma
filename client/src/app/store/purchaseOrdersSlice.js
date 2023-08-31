import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import purchaseOrdersService from "../services/purchase.order.service";
import { login, logout } from "./authSlice";

const initialState = {
  entities: [],
  isLoading: true,
  error: null
};

export const createPurchaseOrder = createAsyncThunk(
  "purchaseOrders/create",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const result = await purchaseOrdersService.create(payload);
      return result;
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
    },
    purchaseOrderUpdateRequested(state) {
      state.errpr = null;
    },
    purchaseOrderUpdated(state, action) {
      const updatedPoIndex = state.entities.findIndex(u => u._id === action.payload._id);
      state.entities[updatedPoIndex] = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    purchaseOrderUpdateFailed(state, action) {
      state.error = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createPurchaseOrder.pending, (state) => {
        state.error = null;
      })

      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.entities.push(action.payload);
        state.error = null;
      })

      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.error = action.payload;
      })

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
        state.entities = [];
      })

      .addCase(login.fulfilled, (state) => {
        loadPurchaseOrdersList();
      });
  }
});

const purchaseOrdersRequestFailed = createAction("purchaseOrders/requestFailed");

const { reducer: purchaseOrdersReducer, actions } = purchaseOrdersSlice;

const {
  purchaseOrdersRequested,
  purchaseOrdersReceived,
  purchaseOrderUpdateRequested,
  purchaseOrderUpdated,
  purchaseOrderUpdateFailed
} = actions;

export const loadPurchaseOrdersList = () => async (dispatch) => {
  dispatch(purchaseOrdersRequested());
  try {
    const content = await purchaseOrdersService.fetchAll();
    dispatch(purchaseOrdersReceived(content));
  } catch (error) {
    dispatch(purchaseOrdersRequestFailed(error.message));
  };
};

export const updatePurchaseOrder = (payload) => async (dispatch) => {
  dispatch(purchaseOrderUpdateRequested);
  try {
    const data = await purchaseOrdersService.update(payload);
    dispatch(purchaseOrderUpdated(data));
  } catch (error) {
    const { code, message } = error.response.data.error;
    if (code === 401) {
      if (message === "NOT_AUTHORIZED") {
        const errorObject = { name: "Cannot edit this user" };
        dispatch(purchaseOrderUpdateFailed(errorObject));
        throw errorObject;
      };
    };
  }
};

export const getPurchaseOrdersList = () => (state) => state.purchaseOrders.entities;

export const getPurchaseOrderById = (id) => (state) => state.purchaseOrders.entities.find(po => po._id === id);

export const getPurchaseOrderError = () => (state) => state.purchaseOrders.error;
export const getPurchaseOrdersLoadingStatus = () => (state) => state.purchaseOrders.isLoading;
export default purchaseOrdersReducer;
