import React from "react";
import "./home.scss";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Home = () => {
  const { currentUser } = useAuth();

  return (<>
    {currentUser?._id
      ? <h1>Hello, {currentUser.name}</h1>
      : <NavLink to="/login">Log in</NavLink>
    }
  </>);
};

export default Home;
