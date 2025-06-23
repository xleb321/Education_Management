import apiClient from "./client";

export const getFacultiesWithDirections = async () => {
  try {
    const response = await apiClient.get("/faculties/with-directions");
    return response.data;
  } catch (error) {
    console.error("Error fetching faculties with directions:", error);
    throw error;
  }
};

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

export default {
  getFacultiesWithDirections,
  getFacultyDetails,
  getDirectionDetails,
};
