import React, { useEffect } from "react";
import "./logout.scss";
import { useDispatch } from "react-redux";
import { logout } from "../../store/users";

const LogOut = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, []);

  return (
    <div className="logout">
      Log out
    </div>
  );
};

export default LogOut;
