import axios from 'axios';

// Use environment variable for API URL, fallback to production URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendtsa.travelsansr.com/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
