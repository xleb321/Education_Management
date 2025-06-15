import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleAuthSuccess = () => {
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isLogin ? "Вход" : "Регистрация"}</h1>

        {isLogin ? (
          <LoginForm onSuccess={handleAuthSuccess} />
        ) : (
          <RegisterForm onSuccess={handleAuthSuccess} />
        )}

        <div className="auth-toggle">
          <button onClick={toggleAuthMode} className="text-button">
            {isLogin
              ? "Нет аккаунта? Зарегистрироваться"
              : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
