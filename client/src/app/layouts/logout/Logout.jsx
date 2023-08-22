import React, { useEffect } from "react";
import "./logout.scss";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useToaster } from "../../hooks/useToaster";

const LogOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToaster();

  useEffect(() => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
        window.location.reload();
      });
  }, []);

  return (
    <div className="logout">
    </div>
  );
};

export default LogOut;
