import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  getPurchaseOrdersLoadingStatus,
  loadPurchaseOrdersList
} from "../../store/purchaseOrdersSlice";
import { CircularProgress } from "@mui/material";

const PurchaseOrdersLoader = ({ children }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getPurchaseOrdersLoadingStatus());
  useEffect(() => {
    dispatch(loadPurchaseOrdersList());
  }, []);

  if (isLoading) return <CircularProgress />;
  return children;
};

PurchaseOrdersLoader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default PurchaseOrdersLoader;
