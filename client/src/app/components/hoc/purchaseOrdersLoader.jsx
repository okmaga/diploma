import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  getPurchaseOrdersLoadingStatus,
  loadPurchaseOrdersList
} from "../../store/purchaseOrdersSlice";
import { CircularProgress } from "@mui/material";
import { getCostCenterLoadingStatus, loadCostCenterList } from "../../store/costCenterSlice";
import { getIsLoggedIn } from "../../store/authSlice";
import { Navigate, useLocation } from "react-router-dom";

const PurchaseOrdersLoader = ({ children }) => {
  const location = useLocation();

  const isLoggedIn = useSelector(getIsLoggedIn());
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace/>;

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
