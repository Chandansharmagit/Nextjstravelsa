import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backendtravelnew.vercel.app/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
