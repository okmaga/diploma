import React from "react";
import "./user.scss";
import { Outlet } from "react-router-dom";
import UsersLoader from "../../components/hoc/usersLoader";

const Users = () => {
  return (
    <UsersLoader>
      <Outlet />
    </UsersLoader>
  );
};

export default Users;
