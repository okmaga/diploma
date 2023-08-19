import { combineReducers, configureStore } from "@reduxjs/toolkit";
import usersReducer from "./users";
import purchaseOrdersReducer from "./purchaseOrders";
import { logger } from "./middleware/logger";

const rootReducer = combineReducers({
  users: usersReducer,
  purchaseOrders: purchaseOrdersReducer
});
export function createStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
  });
};
