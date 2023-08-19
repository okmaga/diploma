import React, { useEffect } from "react";
import UsersTable from "../../../components/ui/UsersTable";
import { useSelector } from "react-redux";
import { getUsers, getUsersError } from "../../../store/users";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UsersListPage = () => {
  const navigate = useNavigate();
  const users = useSelector(getUsers());
  const storeError = useSelector(getUsersError());
  useEffect(() => {
    if (storeError) {
      Object.keys(storeError).map(key => toast.error(storeError[key]));
    };
  }, [storeError]);

  return (
    <div className="users">
      <h1 className="page-title">Users</h1>
      <Button
        sx={{ marginBottom: "2rem" }}
        variant="contained"
        onClick={() => navigate("add")}
      >Add User</Button>
      <div>
        {users.length ? <UsersTable users={users}/> : "No users"}
      </div>
    </div>
  );
};

export default UsersListPage;
