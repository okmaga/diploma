import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { createStore } from "./app/store/createStore";
import { Provider } from "react-redux";
import ThemeContextProvider from "./app/hooks/useThemeContext";

const store = createStore();

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </Provider>
  </React.StrictMode>
);
