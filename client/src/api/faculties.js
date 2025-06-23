import apiClient from "./client";

export const getFacultiesWithDirections = async () => {
  try {
    const response = await apiClient.get("/faculties/with-directions");

    // Проверяем, что ответ существует
    if (!response) {
      throw new Error("Нет ответа от сервера");
    }

    // Сервер возвращает массив напрямую в response.data
    if (Array.isArray(response)) {
      return response;
    }

    throw new Error("Сервер вернул некорректные данные");
  } catch (error) {
    console.error("Error fetching faculties with directions:", error);
    return [];
  }
};

// Остальные функции остаются без изменений
export const getFacultyDetails = async (facultyId) => {
  try {
    const response = await apiClient.get(`/faculties/${facultyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching faculty ${facultyId} details:`, error);
    throw error;
  }
};

export const getDirectionDetails = async (directionId) => {
  try {
    const response = await apiClient.get(`/directions/${directionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching direction ${directionId} details:`, error);
    throw error;
  }
};

const facultiesAPI = {
  getFacultiesWithDirections,
  getFacultyDetails,
  getDirectionDetails,
};

export default facultiesAPI;
