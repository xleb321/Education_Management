import React from "react";
import "./Button.css";

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  ...props
}) => {
  const variantClasses = {
    primary: "button-primary",
    secondary: "button-secondary",
    text: "button-text",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
