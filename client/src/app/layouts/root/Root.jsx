import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./root.scss";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import { useDispatch, useSelector } from "react-redux";
import { getIsLoggedIn, loadAuthData } from "../../store/authSlice";

const Root = () => {
  const isLoggedIn = useSelector(getIsLoggedIn());
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(loadAuthData());
    };
  }, []);

  return (
    <div className="root">
      <NavBar />
      <div className="container">
        <div className="menuContainer">
          <Menu />
        </div>
        <div className="contentContainer">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Root;
