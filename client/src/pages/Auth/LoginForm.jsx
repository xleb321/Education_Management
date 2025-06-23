import React from "react";
import useAuth from "@hooks/useAuth";
import useForm from "@hooks/useForm";
import Input from "@components/common/Input/Input";
import Button from "@components/common/Button/Button";

const LoginForm = ({ onSuccess }) => {
  const { login, loading, error } = useAuth();
  const { values, errors, handleChange, handleSubmit } = useForm(
    {
      email: localStorage.getItem("savedEmail") || "",
      password: "",
    },
    (values) => {
      const errors = {};
      if (!values.email) errors.email = "Email обязателен";
      if (!values.password) errors.password = "Пароль обязателен";
      return errors;
    }
  );

  const onSubmit = (data) => {
    login({ email: data.email, password: data.password })
      .then((response) => {
        if (localStorage.getItem("rememberMe") === "true") {
          localStorage.setItem("savedEmail", data.email);
        }
        onSuccess && onSuccess();
      })
      .catch((err) => {
        console.error("Login error:", err);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="email"
        name="email"
        label="Email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <Input
        type="password"
        name="password"
        label="Пароль"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      <div className="remember-me">
        <input
          type="checkbox"
          id="rememberMe"
          onChange={(e) => {
            localStorage.setItem("rememberMe", e.target.checked.toString());
            if (!e.target.checked) {
              localStorage.removeItem("savedEmail");
            }
          }}
          defaultChecked={localStorage.getItem("rememberMe") === "true"}
        />
        <label htmlFor="rememberMe">Запомнить меня</label>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Button type="submit" disabled={loading}>
        {loading ? "Вход..." : "Войти"}
      </Button>
    </form>
  );
};

export default LoginForm;
