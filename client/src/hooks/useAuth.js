import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@api/client";

export const login = async (credentials) => {
  const response = await apiClient.post("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });
  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post("/auth/register", {
    email: userData.email,
    password: userData.password,
    name: userData.firstName,
    surname: userData.lastName,
    phone: userData.phone,
    patronymic: userData.patronymic || null,
  });

  return {
    token: response.data.token,
    user: response.data.user,
  };
};

export const checkAuth = async () => {
  const response = await apiClient.get("/auth/check");
  return response.data;
};

const useAuth = () => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const saveUserData = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        role_id: user.role_id,
      })
    );
  };

  // При монтировании компонента проверяем аутентификацию
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await checkAuth();
          setUser(user);
          saveUserData(token, user);
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setUser(null);
      }
    };

    checkUserAuth();
  }, []);

  const authLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await login(credentials);
      saveUserData(token, user);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Ошибка авторизации"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const authRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await register(userData);
      saveUserData(token, user);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Ошибка регистрации"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const authLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/login");
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login: authLogin,
    register: authRegister,
    logout: authLogout,
  };
};

export default useAuth;
