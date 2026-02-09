import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// Optional: Add request/response interceptors here if needed in the future

export default api;
