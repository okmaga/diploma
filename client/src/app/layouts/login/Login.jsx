import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import LoginPage from "../../pages/login/LoginPage";
import SignUpPage from "../../pages/signup/SignUpPage";
import "./login.scss";
import { getCurrentUser } from "../../store/authSlice";
import { useSelector } from "react-redux";
const Login = () => {
  const currentUser = useSelector(getCurrentUser());
  const { type } = useParams();
  const [formType, setFormType] = useState(type === "signup" ? type : "login");
  const toggleFormType = () => {
    setFormType(prev => prev === "signup" ? "login" : "signup");
  };
  if (currentUser && currentUser?._id) {
    return <Navigate to="/"></Navigate>;
  }
  return (
    <div className="login">
      {formType === "signup"
        ? <>
          <SignUpPage />
          <p>
            Already have an account?
            <a onClick={toggleFormType}>Log in</a>
          </p>
        </>
        : <>
          <LoginPage toggleFormType={toggleFormType}/>
        </>
      }
    </div>
  );
};

export default Login;
