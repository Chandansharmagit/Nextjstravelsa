import axios from 'axios';
import { CONFIG } from './config';

const api = axios.create({
    baseURL: CONFIG.API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const data = error.response?.data;
        const status = error.response?.status;
        const message = data?.message || data?.error || (typeof data === 'string' ? data : error.message);

        // Silence 401 as it's often an expected state when checking initial auth
        if (status !== 401) {
            console.error('API Error:', message);
        }
        return Promise.reject(error);
    }
);

export default api;
