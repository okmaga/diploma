import React from "react";
import "./navbar.scss";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge } from "@mui/material";
import { NavLink } from "react-router-dom";
import NavProfile from "../ui/NavProfile/NavProfile";
import { getCurrentUser } from "../../store/authSlice";
import { useSelector } from "react-redux";

const NavBar = () => {
  const currentUser = useSelector(getCurrentUser());

  return (
    <div className="navbar">
      <div className="logo">
        <NavLink to="/"><h1>money portal</h1></NavLink>
      </div>
      <div className="icons">
        {currentUser?._id
          ? <> <span className="icon">
            <Badge badgeContent={ 3 } color="warning">
              <NotificationsIcon sx={{ fontSize: 30 }} />
            </Badge></span>
          <span className="icon"><SettingsIcon sx={{ fontSize: 30 }} /></span>
          <span className="icon">
            <NavProfile />
          </span>
          </>
          : (<span>
            <NavLink to="/login">
              Log in
            </NavLink>
          </span>)
        }

      </div>
    </div>
  );
};

export default NavBar;
