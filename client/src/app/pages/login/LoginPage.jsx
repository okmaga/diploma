import React from "react";
import "./loginPage.scss";
import LoginForm from "../../components/ui/loginForm/LoginForm";
import { useAuth } from "../../hooks/useAuth";
import PropTypes from "prop-types";

const LoginPage = ({ toggleFormType }) => {
  const { currentUser } = useAuth();
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
