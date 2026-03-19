const isDev = process.env.NODE_ENV === 'development';

export const CONFIG = {
    API_BASE_URL: isDev ? 'http://localhost:5000/api' : (process.env.NEXT_PUBLIC_API_URL || 'https://backendtsa.travelsansr.com/api'),
    BACKEND_URL: isDev ? 'http://localhost:5000' : 'https://backendtsa.travelsansr.com',
    SITE_URL: isDev ? 'http://localhost:3000' : 'https://www.travelsansr.com',
    CONTACT_EMAIL: 'info@travelsansr.com',
    LOGO_URL: '/logo-new.png',
};

export default CONFIG;
