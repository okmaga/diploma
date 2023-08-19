import React, { useState, useEffect } from "react";
import "./loginForm.scss";
import TextField from "../../../components/common/form/TextField";
import CheckboxField from "../../../components/common/form/CheckboxField";
import { validator } from "../../../utils/validator";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
const LoginForm = () => {
  const { logIn } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
    stayOn: false
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);

  const validatorConfig = {
    password: {
      isRequired: { message: "enter a password" }
    },
    email: {
      isRequired: { message: "enter an email" },
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
      await logIn(data);
      navigate("/");
    } catch (error) {
      setLoginError(error.message);
    };
  };

  const handleChange = (target) => {
    setLoginError(null);
    setData(prev => ({
      ...prev,
      [target.name]: target.value
    }));
  };
  const isValid = Object.keys(errors).length === 0;
  return (
    <div className="login-form">
      <h1 className="form-title">Log in</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
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
          <div className="input-container">
            <CheckboxField
              name="stayOn"
              value={data.stayOn}
              onChange={handleChange}
              label="Remember me"
            />
          </div>
          <Button
            type="submit"
            onClick={handleSubmit}
            variant="contained"
            disabled={!isValid || Boolean(loginError)}
          >Login</Button>
        </form>
        {loginError && <p style={{ color: "darkred" }}>{loginError}</p> }
      </div>
    </div>
  );
};

export default LoginForm;
