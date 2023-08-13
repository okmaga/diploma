import React from "react";
import PropTypes from "prop-types";
import Table from "../common/table/Table";
import { Switch } from "@mui/material";

const UsersTable = ({ users }) => {
  const handleVerify = (name) => {
    console.log(`${name} verified`);
  };
  const columns = {
    index: { name: "#", component: "1" },
    name: { name: "Name", path: "name" },
    email: { name: "Email", path: "email" },
    role: { name: "Role", path: "role" },
    verified: { name: "Verified", path: "verified", component: (user) => <Switch onClick={() => handleVerify(user.name)} /> }
  };

  return (
    <Table data={users} columns={columns}/>
  );
};

UsersTable.propTypes = {
  users: PropTypes.array,
  columns: PropTypes.object
};

export default UsersTable;
