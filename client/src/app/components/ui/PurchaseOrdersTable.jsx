import React from "react";
import PropTypes from "prop-types";
import Table from "../common/table/Table";
import { Switch } from "@mui/material";

const UsersTable = ({ purchaseOrders }) => {
  const handleVerify = (name) => {
    console.log(`${name} verified`);
  };
  const columns = {
    index: { name: "#", component: "1" },
    description: { name: "Description", path: "description" },
    requestor: { name: "Requestor", path: "requestor" },
    amount: { name: "Amount", path: "amount" },
    status: { name: "Status", path: "status", component: (purchaseOrder) => <Switch onClick={() => handleVerify(purchaseOrder.description)} /> }
  };

  return (
    <Table data={purchaseOrders} columns={columns}/>
  );
};

UsersTable.propTypes = {
  purchaseOrders: PropTypes.array,
  columns: PropTypes.object
};

export default UsersTable;
