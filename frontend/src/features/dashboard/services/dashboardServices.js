import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const saveFreight = async (data) => {
    const response = await axios.post(`${API_URL}/api/freight`, data);
    return response.data
}

export const getAllFreight = async () => {
    const response = await axios.get(`${API_URL}/api/freight`);
    return response.data
}