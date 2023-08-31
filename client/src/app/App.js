import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Users from "./pages/users/Users";
import CostCenters from "./pages/costCenters/CostCenters";
import Root from "./layouts/root/Root";
import PurchaseOrdersList from "./pages/purchaseOrders/children/purchaseOrdersList/PurchaseOrdersList";
import Login from "./layouts/login/Login";
import "./styles/global.scss";
import Home from "./pages/home/Home";
import Payments from "./pages/payments/Payments";
import Dashboard from "./pages/dashboard/Dashboard";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { grey, teal } from "@mui/material/colors";
import Logout from "./layouts/logout/Logout";
import AddUserPage from "./pages/users/children/AddUserPage";
import UsersListPage from "./pages/users/children/UsersListPage";
import Toaster from "./components/ui/Toaster";
import ToastProvider from "./hooks/useToaster";
import UserProfilePage from "./pages/users/children/userPage/children/userProfile/UserProfilePage";
import EditUserPage from "./pages/users/children/userPage/children/editUser/EditUserPage";
import UserPage from "./pages/users/children/userPage/UserPage";
import PurchaseOrders from "./pages/purchaseOrders/PurchaseOrders";
import NewPurchaseOrderPage from "./pages/purchaseOrders/children/newPurchaseOrderPage/NewPurchaseOrderPage";
import CssBaseline from "@mui/material/CssBaseline";
import ViewSinglePoPage from "./pages/purchaseOrders/children/singlePoPage/children/viewSinglePoPage/ViewSinglePoPage";
import SinglePoPage from "./pages/purchaseOrders/children/singlePoPage/SinglePoPage";
import EditPoPage from "./pages/purchaseOrders/children/singlePoPage/children/editPoPage/EditPoPage";
import { useThemeContext } from "./hooks/useThemeContext";

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
        element: <PurchaseOrders />,
        children: [
          {
            index: true,
            element: <PurchaseOrdersList />
          },
          {
            path: ":id",
            element: <SinglePoPage />,
            children: [
              {
                index: true,
                element: <ViewSinglePoPage />
              },
              {
                path: "edit",
                element: <EditPoPage />
              }
            ]
          },
          {
            path: "new",
            element: <NewPurchaseOrderPage />
          }
        ]
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
        element: <Users />,
        children: [
          {
            index: true,
            element: <UsersListPage />
          },
          {
            path: ":id",
            element: <UserPage/>,
            children: [
              {
                index: true,
                element: <UserProfilePage />
              },
              {
                path: "edit",
                element: <EditUserPage />
              }
            ]
          },
          {
            path: "add",
            element: <AddUserPage />
          }
        ]
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
  const { mode } = useThemeContext();

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
          primary: {
            main: teal[700]
          },
          divider: "#ccc",
          text: {
            primary: grey[900],
            secondary: grey[800]
          }
        } : {
          primary: {
            main: "#00bfa5"
          },
          divider: "#ccc",
          background: {
            default: "#2a3447",
            paper: "#2a3447"
          },
          text: {
            primary: "#fff",
            secondary: grey[500]
          }
        })
    },
    components: {
      MuiLoadingButton: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            ...(ownerState.loading && {
              "&.Mui-disabled": {
                backgroundColor: teal[400]
              }
            })
          }),
          loadingIndicator: ({
            color: "#fff"
          })
        }
      }
    }
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <RouterProvider router={router}/>
          <Toaster />
        </ToastProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
