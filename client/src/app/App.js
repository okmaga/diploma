import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Users from "./pages/users/Users";
import CostCenters from "./pages/costCenters/CostCenters";
import Root from "./layouts/root/Root";
import PurchaseOrders from "./pages/purchaseOrders/PurchaseOrders";
import Login from "./layouts/login/Login";
import "./styles/global.scss";
import Home from "./pages/home/Home";
import Payments from "./pages/payments/Payments";
import Dashboard from "./pages/dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { teal } from "@mui/material/colors";
import AuthProvider from "./hooks/useAuth";
import Logout from "./layouts/logout/Logout";

const theme = createTheme({
  palette: {
    primary: {
      main: teal[700]
    }
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "purchase-orders",
        element: <PurchaseOrders />
      },
      {
        path: "payments",
        element: <Payments />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "users",
        element: <Users />
      },
      {
        path: "cost-centers",
        element: <CostCenters />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "logout",
        element: <Logout />
      }
    ]
  }
]);
function App() {
  return (
    <>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router}/>
          <ToastContainer />
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

export default App;
