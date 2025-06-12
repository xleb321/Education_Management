import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    course: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (
      errors.confirmPassword &&
      (name === "password" || name === "confirmPassword")
    ) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Пароли не совпадают",
      }));
      return false;
    }
    return true;
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords don't match" });
      return;
    }

    try {
      const apiBase = process.env.REACT_APP_API_URL || "";
      const url = isLogin
        ? `${apiBase}/api/auth/login`
        : `${apiBase}/api/auth/register`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(isLogin ? loginData : formData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server error: ${text.substring(0, 100)}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      console.log("Auth success:", data);
      navigate("/");
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({
        submit: error.message.includes("Server error")
          ? "Server configuration error"
          : error.message,
      });
    }
  };

  return (
    <div className="auth-page">
      <h1>{isLogin ? "Авторизация" : "Регистрация"}</h1>

      {errors.form && <div className="error-message">{errors.form}</div>}
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Имя*:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Фамилия*:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email*:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Телефон*:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+7 (___) ___-____"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="birthDate">Дата рождения*:</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="course">Направление*:</label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Выберите --</option>
                  <option value="cs">Компьютерные науки</option>
                  <option value="engineering">Инженерия</option>
                  <option value="business">Бизнес</option>
                  <option value="medicine">Медицина</option>
                </select>
              </div>
            </div>
          </>
        )}

        {isLogin ? (
          <>
            <div className="form-group">
              <label htmlFor="loginEmail">Email:</label>
              <input
                type="email"
                id="loginEmail"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Пароль:</label>
              <input
                type="password"
                id="loginPassword"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Пароль*:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Повторите пароль*:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && (
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className="button"
          disabled={!isLogin && Object.keys(errors).length > 0}
        >
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>

      <div className="toggle-auth">
        <button onClick={toggleAuthMode} className="toggle-button">
          {isLogin
            ? "Нет аккаунта? Зарегистрироваться"
            : "Уже есть аккаунт? Войти"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
