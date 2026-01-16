import axios from 'axios';

const API_URL="http://127.0.0.1:3001/api/auth"

export const register = async (data) =>{
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
};

export const login = async (data) =>{
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(
    `${API_URL}/forgot-password`,
    { email }
  );
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await axios.post(
    `${API_URL}/reset-password`,
    { token, newPassword }
  );
  return response.data;
};

export const changePassword = async (data, token) => {
  const response = await axios.put(
    `${API_URL}/change-password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};