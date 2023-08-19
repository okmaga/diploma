import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./addUserForm.scss";
import TextField from "../../common/form/TextField";
import { validator } from "../../../utils/validator";
import { LoadingButton } from "@mui/lab";
import SelectField from "../../common/form/SelectField";
import CheckboxField from "../../common/form/CheckboxField";
import { useAuth } from "../../../hooks/useAuth";
import { useToaster } from "../../../hooks/useToaster";
import PropTypes from "prop-types";
import userService from "../../../services/user.service";

const AddUserForm = ({ mode = "new", userData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToaster();
  const navigate = useNavigate();
  const [data, setData] = useState({
    _id: userData?._id || null,
    email: userData?.email || "",
    name: userData?.name || "",
    password: "",
    role: userData?.role || "",
    edit: mode === "edit",
    logMeIn: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const roleOptions = [
    { label: "user", value: "user" },
    { label: "manager", value: "manager" },
    { label: "admin", value: "admin" }
  ];

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
    },
    role: {
      isRequired: { message: "please select a role" }
    }
  };
  useEffect(() => {
    const isValid = validate();
    setIsSubmitDisabled(!isValid);
  }, [data]);

  const validate = () => {
    const formErrors = validator(data, validatorConfig);
    setFormErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const isValid = validate();
    if (!isValid) return;
    if (mode === "new") {
      try {
        const newUser = await signUp(data);
        if (data.logMeIn) {
          navigate("/");
        } else {
          navigate("/users");
          toast.success(`A new ${newUser.role} ${newUser.name} was added`);
        };
        setIsLoading(false);
      } catch (error) {
        setFormErrors(error);
        setIsLoading(false);
      };
    } else {
      try {
        await userService.update(data);
        navigate("/users");
        setIsLoading(false);
      } catch (error) {
        setFormErrors(error);
        setIsLoading(false);
      }
    };
  };

  const handleChange = (target) => {
    setData(prev => ({
      ...prev,
      [target.name]: target.value
    }));
  };

  return (
    <div className="add-user-form">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <TextField
              label="Name"
              name="name"
              value={data.name}
              onChange={handleChange}
              error={formErrors.name}
            />
          </div>
          <div className="input-container">
            <TextField
              label="Email"
              name="email"
              value={data.email}
              onChange={handleChange}
              error={formErrors.email}
            />
          </div>
          <div className="input-container">
            <TextField
              label="Password"
              type="password"
              name="password"
              onChange={handleChange}
              error={formErrors.password}
            />
          </div>
          <div className="input-container">
            <SelectField
              label="Role"
              name="role"
              onChange={handleChange}
              error={formErrors.role}
              options={roleOptions}
              value={data.role}
            />
          </div>
          <div className="input-container">
            <CheckboxField
              label="Log me in"
              name="logMeIn"
              checked={data.logMeIn}
              onChange={handleChange}
            />
          </div>
          <LoadingButton
            type="submit"
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitDisabled}
            loading={isLoading}
            loadingPosition="center"
          >{mode === "new" ? "Submit" : "Save"}</LoadingButton>
        </form>
      </div>
    </div>
  );
};

AddUserForm.propTypes = {
  mode: PropTypes.string,
  userData: PropTypes.object
};

export default AddUserForm;
