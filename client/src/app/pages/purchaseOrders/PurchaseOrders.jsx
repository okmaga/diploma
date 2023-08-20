import React from "react";
import "./purchaseOrders.scss";
import PurchaseOrdersTable from "../../components/ui/PurchaseOrdersTable";
import { useSelector } from "react-redux";
import { getPurchaseOrdersList } from "../../store/purchaseOrdersSlice";
import PurchaseOrdersLoader from "../../components/hoc/purchaseOrdersLoader";

const PurchaseOrders = () => {
  const purchaseOrders = useSelector(getPurchaseOrdersList());
  return (
    <div className="purchase-orders">
      <h1 className="page-title">PurchaseOrders</h1>
      <PurchaseOrdersLoader>
        <PurchaseOrdersTable purchaseOrders={purchaseOrders}/>
      </PurchaseOrdersLoader>
    </div>
  );
};

export default PurchaseOrders;
