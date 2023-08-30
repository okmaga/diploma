import React, { useState } from "react";
import PropTypes, { oneOfType } from "prop-types";
import { TextField as TextFieldMui } from "@mui/material";

const TextField = ({ label, name, type, value, placeholder, required, onChange, error, ...rest }) => {
  const [isTouched, setIsTouched] = useState(false);
  const handleChange = ({ target }) => {
    onChange({ name: target.name, value: target.value });
    setIsTouched(false);
  };
  const handleBlur = ({ target }) => {
    if (target.value) {
      setIsTouched(true);
    };
  };

  return (
    <>
      <TextFieldMui
        {...rest}
        label={label}
        error={Boolean(isTouched && error)}
        helperText={isTouched && error}
        type={type}
        id={name}
        name={name}
        value={value}
        margin="normal"
        required={required}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </>
  );
};

TextField.defaultProps = {
  type: "text"
};

TextField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.string
};

export default TextField;
