import React from "react";
import "./Input.css";

const Input = ({
  type = "text",
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`form-control ${error ? "error" : ""}`}
        {...props}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Input;
