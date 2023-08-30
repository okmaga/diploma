import React from "react";
import "./navbar.scss";
import { NavLink } from "react-router-dom";
import NavProfile from "../ui/NavProfile/NavProfile";
import { getCurrentUser } from "../../store/authSlice";
import { useSelector } from "react-redux";
import SettingsMenu from "../ui/settingsMenu/SettingsMenu";

const NavBar = () => {
  const currentUser = useSelector(getCurrentUser());

  return (
    <div className="navbar">
      <div className="logo">
        <NavLink to="/"><h1>money portal</h1></NavLink>
      </div>
      <div className="icons">
        {currentUser?._id
          ? <>
            <span className="icon">
              <SettingsMenu />
            </span>
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
