import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./purchaseOrdersList.scss";
import PurchaseOrdersTable from "../../../../components/ui/PurchaseOrdersTable";
import { useSelector } from "react-redux";
import { getPurchaseOrderError, getPurchaseOrdersList } from "../../../../store/purchaseOrdersSlice";
import { useToaster } from "../../../../hooks/useToaster";
import { getCostCenterList } from "../../../../store/costCenterSlice";
import { Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const PurchaseOrdersList = () => {
  const purchaseOrders = useSelector(getPurchaseOrdersList());
  const costCenters = useSelector(getCostCenterList());
  const error = useSelector(getPurchaseOrderError());
  const navigate = useNavigate();
  const { toast } = useToaster();
  useEffect(() => {
    if (error) {
      toast.error(error);
    };
  }, [error]);

  return (
    <div className="purchase-orders">
      <h1 className="page-title">Purchase orders</h1>
      <Button
        sx={{ marginBottom: "2rem" }}
        variant="contained"
        startIcon={<AddShoppingCartIcon />}
        onClick={() => navigate("new")}
      >Create </Button>
      {purchaseOrders.length > 0 &&
        <PurchaseOrdersTable
          purchaseOrders={purchaseOrders}
          costCenters={costCenters}
        />}
    </div>
  );
};

export default PurchaseOrdersList;
