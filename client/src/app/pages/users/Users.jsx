import React from "react";
import "./user.scss";
import { Outlet, Navigate } from "react-router-dom";
import UsersLoader from "../../components/hoc/usersLoader";
import { getAuthDataLoading, getCurrentUser } from "../../store/authSlice";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

const Users = () => {
  const currentUser = useSelector(getCurrentUser());
  const authDataLoading = useSelector(getAuthDataLoading());
  if (authDataLoading) return <CircularProgress />;
  return (
    currentUser?.role !== "user"
      ? <UsersLoader>
        <Outlet />
      </UsersLoader>
      : <Navigate to="/"/>
  );
};

export default Users;
