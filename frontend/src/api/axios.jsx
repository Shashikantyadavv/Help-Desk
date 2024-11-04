import axios from 'axios';

const axios = axios.create({
  baseURL: 'https://help-desk-ows2.onrender.com/api',
});

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
