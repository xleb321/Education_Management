// src/pages/Auth/LoginForm.jsx
import React from "react";
import useAuth from "../../hooks/useAuth";
import useForm from "../../hooks/useForm"; // Добавляем импорт хука
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";

const LoginForm = ({ onSuccess }) => {
  const { login, loading, error } = useAuth();
  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: "", password: "" },
    (values) => {
      const errors = {};
      if (!values.email) errors.email = "Email обязателен";
      if (!values.password) errors.password = "Пароль обязателен";
      return errors;
    }
  );

  const onSubmit = (data) => {
    login(data).then(() => onSuccess && onSuccess());
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

      {error && <div className="error-message">{error}</div>}

      <Button type="submit" disabled={loading}>
        {loading ? "Вход..." : "Войти"}
      </Button>
    </form>
  );
};

export default LoginForm;
