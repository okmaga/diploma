import React from "react";
import "./user.scss";
import { Outlet, Navigate } from "react-router-dom";
import UsersLoader from "../../components/hoc/usersLoader";
import { getCurrentUser } from "../../store/authSlice";
import { useSelector } from "react-redux";

const Users = () => {
  const currentUser = useSelector(getCurrentUser());
  return (
    currentUser?.role !== "user"
      ? <UsersLoader>
        <Outlet />
      </UsersLoader>
      : <Navigate to="/"/>
  );
};

export default Users;
