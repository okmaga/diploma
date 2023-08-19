import React from "react";
import PropTypes from "prop-types";
import { FormControlLabel, Checkbox } from "@mui/material";

const CheckboxField = ({ label, name, checked, onChange, error }) => {
  const handleChange = () => {
    onChange({ name, value: !checked });
  };
  return (
    <FormControlLabel control={
      <Checkbox
        name={name}
        label={label}
        onChange={handleChange}
        checked={checked}
      />
    } label={label}
    />
  );
};

CheckboxField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  checked: PropTypes.bool
};

export default CheckboxField;
