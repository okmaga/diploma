import React, { useEffect, useMemo } from "react";
import "./costCenters.scss";
import CostCenterCard from "../../components/ui/costCenterCard/CostCenterCard";
import { useDispatch, useSelector } from "react-redux";
import { getCostCenterList, getCostCenterLoadingStatus, loadCostCenterList } from "../../store/costCenterSlice";
import {
  getPurchaseOrdersList,
  getPurchaseOrdersLoadingStatus,
  loadPurchaseOrdersList
} from "../../store/purchaseOrdersSlice";
import { CircularProgress } from "@mui/material";
import { getCurrentUser } from "../../store/authSlice";
import { Navigate } from "react-router-dom";

const CostCenters = () => {
  const currentUser = useSelector(getCurrentUser());
  const costCenters = useSelector(getCostCenterList());
  const pos = useSelector(getPurchaseOrdersList());
  const ccLoading = useSelector(getCostCenterLoadingStatus());
  const poLoading = useSelector(getPurchaseOrdersLoadingStatus());
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadCostCenterList());
    dispatch(loadPurchaseOrdersList());
  }, []);

  const ccTotalSpent = useMemo(() => {
    return costCenters.map(cc => {
      const { _id } = cc;
      const totalSpent = pos.reduce((acc, po) => {
        if (po.costCenter === _id && po.status === "Approved") return acc + po.amount;
        else return acc;
      }, 0);
      return { _id, totalSpent };
    });
  }, [pos, costCenters]);

  if (currentUser?.role === "user") return <Navigate to="/"/>;
  if (poLoading || ccLoading) return <CircularProgress />;

  return (
    <div className="costCenters">
      <h1 className="page-title">Cost Centers</h1>
      <p>RUB in 000s</p>
      <div className="page-container">
        {costCenters.map(cc => {
          return <CostCenterCard
            key={cc._id}
            name={cc.title}
            value={ccTotalSpent.find(ccTotal => ccTotal._id === cc._id).totalSpent}
            limit={cc.limit}
          />;
        })}
      </div>
    </div>
  );
};

export default CostCenters;
