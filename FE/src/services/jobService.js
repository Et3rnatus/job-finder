import axios from 'axios';

const API_URL = 'http://127.0.0.1:3001/api/jobs';

export const getJobs = async () =>{
    const response = await axios.get(API_URL);
    return response.data;
};

export const getJobDetail = async (id) =>{
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
}