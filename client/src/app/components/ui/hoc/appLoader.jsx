import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getUsersLoadingStatus, loadUsersList } from "../../../store/users";

const AppLoader = ({ children }) => {
  console.log("APP LOADER IN THE BUSINESS OK++++++");
  const dispatch = useDispatch();
  const isLoading = useSelector(getUsersLoadingStatus());
  dispatch(loadUsersList());
  if (isLoading) return "loading...";
  return children;
};

AppLoader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default AppLoader;
