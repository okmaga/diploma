import React from "react";
import { Outlet } from "react-router-dom";
import "./purchaseOrders.scss";
import PurchaseOrdersLoader from "../../components/hoc/purchaseOrdersLoader";

const PurchaseOrders = () => {
  return (
    <PurchaseOrdersLoader>
      <Outlet />
    </PurchaseOrdersLoader>
  );
};

export default PurchaseOrders;
