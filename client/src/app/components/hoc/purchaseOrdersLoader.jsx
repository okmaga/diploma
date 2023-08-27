import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  getPurchaseOrdersLoadingStatus,
  loadPurchaseOrdersList
} from "../../store/purchaseOrdersSlice";
import { CircularProgress } from "@mui/material";
import { getCostCenterLoadingStatus, loadCostCenterList } from "../../store/costCenterSlice";

const PurchaseOrdersLoader = ({ children }) => {
  const dispatch = useDispatch();
  const purchaseOrdersLoading = useSelector(getPurchaseOrdersLoadingStatus());
  const costCentersLoading = useSelector(getCostCenterLoadingStatus());
  useEffect(() => {
    dispatch(loadPurchaseOrdersList());
    dispatch(loadCostCenterList());
  }, []);

  if (purchaseOrdersLoading || costCentersLoading) return <CircularProgress />;
  return children;
};

PurchaseOrdersLoader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default PurchaseOrdersLoader;
