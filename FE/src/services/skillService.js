import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api";

export const getSkills = async () => {
  const res = await axios.get(`${API_URL}/skills`);
  return res.data;
};
