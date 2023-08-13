import React from "react";
import PropTypes from "prop-types";

const SelectField = ({ label, name, value, defaultValue, options, onChange, error }) => {
  const handleChange = ({ target }) => {
    onChange({ name: target.name, value: target.value });
  };
  return (
    <>
      <label htmlFor={name}>
        {label} {error && <small>- {error}</small>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        required
        aria-invalid={ (error && true) || (!error && false) }
      >
        <option value="" disabled>{defaultValue}</option>
        {options.map(option => {
          return <option key={option.value} value={option.value}>{option.label}</option>;
        })}
      </select>
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
  error: PropTypes.string
};

export default SelectField;
