import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://scm-api.mallon.click',
    baseURL: 'http://127.0.0.1:8000',
});

export default api;