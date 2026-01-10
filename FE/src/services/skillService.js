import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/skills";

/**
 * Lấy skill theo ngành nghề (CHO JOB)
 */
export const getSkillsByCategory = async (categoryId) => {
  if (!categoryId) return [];

  const res = await axios.get(
    `${API_URL}/by-category/${categoryId}`
  );

  return res.data;
};

/**
 * Lấy toàn bộ skill (CHO CANDIDATE)
 */
export const getAllSkills = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
