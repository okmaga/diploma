import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import "./signUpPage.scss";
import TextField from "../../components/common/form/TextField";
import { validator } from "../../utils/validator";
import { Button } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

const SignUpPage = () => {
  // const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
    role: ""
  });
  const [errors, setErrors] = useState({});
  const { signUp } = useAuth();

  const validatorConfig = {
    name: {
      isRequired: { message: "enter a username" },
      lettersOnly: { message: "name can only contain letters" }
    },
    password: {
      isRequired: { message: "enter a password" },
      min: { value: 6, message: "password should be at least 6 characters long" },
      isContainDigit: { message: "password should contain at least 1 digit" },
      isCapitalSymbol: { message: "password should contain at least one capital letter" }
    },
    email: {
      isRequired: { message: "enter a valid email" },
      isEmail: { message: "enter a valid email" }
    }
  };
  useEffect(() => {
    validate();
  }, [data]);

  const validate = () => {
    const errors = validator(data, validatorConfig);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;
    try {
      await signUp(data);
    } catch (error) {
      setErrors(error);
    };
  };

  const handleChange = (target) => {
    setData(prev => ({
      ...prev,
      [target.name]: target.value
    }));
  };
  return (
    <div className="signup-page">
      <h1 className="page-title">Sign up</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <TextField
              label="Name"
              name="name"
              onChange={handleChange}
              error={errors.name}
            />
          </div>
          <div className="input-container">
            <TextField
              label="Email"
              name="email"
              onChange={handleChange}
              error={errors.email}
            />
          </div>
          <div className="input-container">
            <TextField
              label="Password"
              type="password"
              name="password"
              onChange={handleChange}
              error={errors.password}
            />
          </div>
          <Button
            type="submit"
            onClick={handleSubmit}
            variant="contained"
          >Sign up</Button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
