import axios from "axios";

export const applyJob = (data) => {
  return axios.post('/applications', data);
};
