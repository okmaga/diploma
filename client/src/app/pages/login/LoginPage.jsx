import React from "react";
import "./loginPage.scss";
import LoginForm from "../../components/ui/loginForm/LoginForm";
import PropTypes from "prop-types";
import { getCurrentUser } from "../../store/authSlice";
import { useSelector } from "react-redux";

const LoginPage = ({ toggleFormType }) => {
  const currentUser = useSelector(getCurrentUser());
  return (
    <>
      {currentUser && currentUser?._id
        ? <h1>Hello, {currentUser.name}</h1>
        : <>
          <LoginForm />
          <p>
            Don`t have an account?
            <a onClick={toggleFormType}>Sign up</a>
          </p>
        </>}
    </>
  );
};

LoginPage.propTypes = {
  toggleFormType: PropTypes.func
};
export default LoginPage;
