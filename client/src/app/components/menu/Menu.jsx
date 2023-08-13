import React from "react";
import "./menu.scss";
import { NavLink } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaidIcon from "@mui/icons-material/Paid";

const Menu = () => {
  return (
    <div className="menu">
      <div className="item">
        <span className="title">MAIN</span>
        <NavLink className="listItem" to="/purchase-orders">
          <ShoppingCartIcon />
          <span className="listItemTitle">Purchase orders</span>
        </NavLink>
        <NavLink className="listItem" to="/payments">
          <PaidIcon />
          <span className="listItemTitle">Payments</span>
        </NavLink>
      </div>
      <div className="item">
        <span className="title">MANAGER</span>
        <NavLink className="listItem" to="/dashboard">
          <DashboardIcon />
          <span className="listItemTitle">Dashboard</span>
        </NavLink>
      </div>

      <div className="item">
        <span className="title">ADMIN</span>
        <NavLink className="listItem" to="/users">
          <PeopleIcon />
          <span className="listItemTitle">Users</span>
        </NavLink>
        <NavLink className="listItem" to="/cost-centers">
          <PieChartIcon />
          <span className="listItemTitle">Cost centers</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Menu;
