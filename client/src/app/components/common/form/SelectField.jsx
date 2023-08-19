import React, { useState } from "react";
import PropTypes from "prop-types";
import { FormControl, FormHelperText, InputLabel, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const SelectField = ({ label, name, value, options, onChange, error, required }) => {
  const [isTouched, setIsTouched] = useState(false);
  const handleChange = ({ target }) => {
    onChange({ name: target.name, value: target.value });
  };

  const handleBlur = ({ target }) => {
    if (target.value) {
      setIsTouched(true);
    };
  };

  return (
    <>
      <FormControl
        sx={{ minWidth: 120 }}
        error={Boolean(isTouched && error)}
        required={required}
        margin="normal"
      >
        <InputLabel id={label}>{label}</InputLabel>
        <Select
          labelId={label}
          name={name}
          value={value}
          label={label}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
        {isTouched && error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </>
  );
};

SelectField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool
};

export default SelectField;
