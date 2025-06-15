import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Удалите interceptor если он не нужен для базовой работы
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    throw error;
  }
);

// Используйте именованные экспорты
export const checkHealth = () => apiClient.get("/health");
export const getWelcomeMessage = () => apiClient.get("/");

// Или альтернативно можно экспортировать объект
export default {
  checkHealth,
  getWelcomeMessage,
};
