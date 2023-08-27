import React from "react";
import PropTypes from "prop-types";
import Table from "../common/table/Table";
import { Switch } from "@mui/material";
import AlertDialog from "../AlertDialog";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../store/usersSlice";
import { useToaster } from "../../hooks/useToaster";
import { useNavigate } from "react-router-dom";

const UsersTable = ({ users }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToaster();

  const handleVerify = (name) => {
    console.log(`${name} verified`);
  };
  const handleDeleteConfirm = async (e, user) => {
    try {
      await dispatch(deleteUser(user._id));
      toast.info(`${user.role} ${user.name} deleted`);
    } catch (error) {
      Object.keys(error).map(key => toast.error(error[key]));
    };
  };
  const handleRowClick = (user) => {
    navigate(`${user._id}`);
  };
  const columns = {
    index: { name: "#", component: (user, i) => i + 1 },
    name: { name: "Name", path: "name" },
    email: { name: "Email", path: "email" },
    role: { name: "Role", path: "role" },
    verified: { name: "Verified", path: "verified", component: (user) => <Switch onClick={() => handleVerify(user.name)} /> },
    deleteButton: {
      name: "",
      component: (user) => <AlertDialog
        label="Delete"
        triggerColor="error"
        size="small"
        alertTitle="Delete user?"
        alertText="The user will be deleted permanently"
        onConfirm={(e) => handleDeleteConfirm(e, user)}
      >Delete</AlertDialog>
    }
  };

  return (
    <Table
      data={users}
      columns={columns}
      onRowClick={handleRowClick}
    />
  );
};

UsersTable.propTypes = {
  users: PropTypes.array,
  columns: PropTypes.object
};

export default UsersTable;
