import React, { useState } from "react";
import "./purchaseOrders.scss";
import purchaseOrderService from "../../services/purchase.order.service";
import PurchaseOrdersTable from "../../components/ui/PurchaseOrdersTable";

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState();
  const fetchPurchaseOrders = async () => {
    try {
      const content = await purchaseOrderService.fetchAll();
      console.log(content);
      setPurchaseOrders(content);
    } catch (error) {
      console.log(error);
    };
  };
  return (
    <div className="purchase-orders">
      <h1 className="page-title">PurchaseOrders</h1>
      <button onClick={fetchPurchaseOrders}>Fetch Purchase Orders</button>
      {purchaseOrders && <PurchaseOrdersTable
        purchaseOrders={purchaseOrders}
      />}
    </div>
  );
};

export default PurchaseOrders;
