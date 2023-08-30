import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getUsersLoadingStatus, loadUsersList } from "../../store/usersSlice";
import { CircularProgress } from "@mui/material";
import { getIsLoggedIn } from "../../store/authSlice";
import { useToaster } from "../../hooks/useToaster";
import { Navigate, useLocation } from "react-router-dom";

const UsersLoader = ({ children }) => {
  const location = useLocation();
  const { toast } = useToaster();
  const isLoggedIn = useSelector(getIsLoggedIn());
  const dispatch = useDispatch();
  const isLoading = useSelector(getUsersLoadingStatus());
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(loadUsersList());
    } else {
      toast.info("Please log in or contact administrator");
    }
  }, [isLoggedIn]);
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (isLoading) return <CircularProgress />;
  return children;
};

UsersLoader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default UsersLoader;
