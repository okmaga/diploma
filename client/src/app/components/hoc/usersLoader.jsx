import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getUserDataStatus, loadUsersList } from "../../store/usersSlice";
import { CircularProgress } from "@mui/material";
import { getIsLoggedIn } from "../../store/authSlice";
import { Navigate, useLocation } from "react-router-dom";

const UsersLoader = ({ children }) => {
  const usersDataLoaded = useSelector(getUserDataStatus());
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn());
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(loadUsersList());
    };
  }, [isLoggedIn]);

  if (!usersDataLoaded) return <CircularProgress />;
  return children;
};

UsersLoader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default UsersLoader;
