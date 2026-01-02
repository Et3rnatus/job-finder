import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/candidate";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};


const getProfile = async () => {
  const res = await axios.get(`${API_URL}/profile`, {
    headers: getAuthHeader(),
  });
  return res.data;
};


const checkProfile = async () => {
  const res = await axios.get(`${API_URL}/check-profile`, {
    headers: getAuthHeader(),
  });
  return res.data; 
};


const updateProfile = async (data) => {
  const res = await axios.put(`${API_URL}/profile`, data, {
    headers: getAuthHeader(),
  });


  return res.data;
};

export default {
  getProfile,
  checkProfile,
  updateProfile,
};
