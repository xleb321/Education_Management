import React from "react";
import useAuth from "@hooks/useAuth";
import useForm from "@hooks/useForm";
import Input from "@components/common/Input/Input";
import Button from "@components/common/Button/Button";

const RegisterForm = ({ onSuccess }) => {
  const { register, loading, error } = useAuth();
  const { values, errors, handleChange, handleSubmit } = useForm(
    {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      course: "",
      birthDate: "",
      password: "",
      confirmPassword: "",
    },
    (values) => {
      const errors = {};
      if (!values.firstName) errors.firstName = "Имя обязательно";
      if (!values.email) errors.email = "Email обязателен";
      if (!values.phone) errors.phone = "Телефон обязателен";
      if (!values.password) errors.password = "Пароль обязателен";
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Пароли не совпадают";
      }
      return errors;
    }
  );

  const onSubmit = (data) => {
    register({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      patronymic: data.patronymic,
    })
      .then(() => {
        localStorage.setItem("savedEmail", data.email);
        onSuccess && onSuccess();
      })
      .catch((err) => {
        console.error("Registration error:", err);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <Input
          name="firstName"
          label="Имя"
          value={values.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
        />
        <Input
          name="lastName"
          label="Фамилия"
          value={values.lastName}
          onChange={handleChange}
        />
      </div>

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
        type="tel"
        name="phone"
        label="Телефон"
        value={values.phone}
        onChange={handleChange}
        error={errors.phone}
        required
        placeholder="+7 (___) ___-____"
      />

      <div className="form-row">
        <Input
          type="date"
          name="birthDate"
          label="Дата рождения"
          value={values.birthDate}
          onChange={handleChange}
        />
        <div className="form-group">
          <label htmlFor="course">Направление</label>
          <select
            id="course"
            name="course"
            value={values.course}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Выберите направление</option>
            <option value="cs">Компьютерные науки</option>
            <option value="engineering">Инженерия</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <Input
          type="password"
          name="password"
          label="Пароль"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          label="Подтвердите пароль"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <Button type="submit" disabled={loading}>
        {loading ? "Регистрация..." : "Зарегистрироваться"}
      </Button>
    </form>
  );
};

export default RegisterForm;
