import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/categories";

// ======================
// CATEGORY (PUBLIC / EMPLOYER)
// ======================

// Lấy danh sách category đang active
// Dùng cho: Create Job, Filter Job
export const getCategories = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export default {
  getCategories,
};
