import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getUsersLoadingStatus, loadUsersList } from "../../store/usersSlice";
import { CircularProgress } from "@mui/material";

const UsersLoader = ({ children }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getUsersLoadingStatus());
  useEffect(() => {
    dispatch(loadUsersList());
  }, []);

  if (isLoading) return <CircularProgress />;
  return children;
};

UsersLoader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default UsersLoader;
