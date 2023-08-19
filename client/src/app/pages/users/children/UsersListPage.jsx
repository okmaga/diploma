import React from "react";
import UsersTable from "../../../components/ui/UsersTable";
import UsersLoader from "../../../components/ui/hoc/usersLoader";
import { useSelector } from "react-redux";
import { getUsers, getUsersError } from "../../../store/users";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UsersListPage = () => {
  const navigate = useNavigate();
  const users = useSelector(getUsers());
  const error = useSelector(getUsersError());
  if (error?.status === 401) {
    toast.error("Not authorised to do this");
  };

  return (
    <div className="users">
      <h1 className="page-title">Users</h1>
      <Button
        sx={{ marginBottom: "2rem" }}
        variant="contained"
        onClick={() => navigate("add")}
      >Add User</Button>
      <div>
        <UsersLoader>
          {users.length ? <UsersTable users={users}/> : "No users"}
        </UsersLoader>
      </div>
    </div>
  );
};

export default UsersListPage;
