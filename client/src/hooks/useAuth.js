import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

export const login = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

export const checkAuth = async () => {
  const response = await apiClient.get("/auth/check");
  return response.data;
};

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const authLogin = async (credentials) => {
    setLoading(true);
    try {
      const { token, user } = await login(credentials);
      localStorage.setItem("token", token);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const authRegister = async (userData) => {
    setLoading(true);
    try {
      await register(userData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const authLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const checkUserAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const user = await checkAuth();
        setUser(user);
      }
    } catch (err) {
      localStorage.removeItem("token");
    }
  };

  return {
    user,
    loading,
    error,
    login: authLogin,
    register: authRegister,
    logout: authLogout,
    checkAuth: checkUserAuth,
  };
};

export default useAuth; // Дефолтный экспорт
