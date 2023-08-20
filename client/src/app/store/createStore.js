import { combineReducers, configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import authReducer from "./authSlice";
import purchaseOrdersReducer from "./purchaseOrdersSlice";
import { logger } from "./middleware/logger";

const rootReducer = combineReducers({
  users: usersReducer,
  auth: authReducer,
  purchaseOrders: purchaseOrdersReducer
});
export function createStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
  });
};
