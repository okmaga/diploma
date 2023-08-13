import React, { useEffect } from "react";
import "./logout.scss";
import { useAuth } from "../../hooks/useAuth";

const LogOut = () => {
  const { logOut } = useAuth();

  useEffect(() => {
    logOut();
  }, []);

  return (
    <div className="logout">
      Log out
    </div>
  );
};

export default LogOut;
