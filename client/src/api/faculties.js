import apiClient from "./client";

export const getFaculties = async () => {
  return apiClient.get("/faculties");
};

export default {
  getFaculties,
};
