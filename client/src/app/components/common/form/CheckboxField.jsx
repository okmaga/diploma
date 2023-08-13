import React from "react";
import PropTypes from "prop-types";
import { FormControlLabel, Checkbox } from "@mui/material";

const CheckboxField = ({ label, name, onChange, value, error }) => {
  const handleChange = () => {
    onChange({ name, value: !value });
  };
  return (
    <FormControlLabel control={
      <Checkbox
        name={name}
        label={label}
        onChange={handleChange}
        checked={value}
      />
    } label={label}
    />
  );
};

CheckboxField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.bool,
  error: PropTypes.string
};

export default CheckboxField;
