import React from "react";
import { Outlet } from "react-router-dom";
import UsersLoader from "../../components/ui/hoc/usersLoader";

const UserPage = () => {
  return (
    <UsersLoader>
      <Outlet />
    </UsersLoader>
  );
};

export default UserPage;
