import React, { useEffect } from "react";
import UsersTable from "../../../components/ui/UsersTable";
import { useSelector } from "react-redux";
import { getUsers, getUsersError } from "../../../store/usersSlice";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useToaster } from "../../../hooks/useToaster";

const UsersListPage = () => {
  const { toast } = useToaster();
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
      <div style={{ color: "darkred", marginTop: "1rem" }}>
        {storeError && Object.keys(storeError).map(key => <p key={key}>{storeError[key]}</p>)}
      </div>
    </div>
  );
};

export default UsersListPage;
