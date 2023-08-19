import React from "react";
import "./signUpPage.scss";
import AddUserForm from "../../components/ui/addUserForm/AddUserForm";

const SignUpPage = () => {
  return (
    <div className="signup-page">
      <h1 className="page-title">Sign up</h1>
      <AddUserForm />
    </div>
  );
};

export default SignUpPage;
