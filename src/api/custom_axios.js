import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const API = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("login-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },  
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized! Redirecting...");
            // Handle unauthorized access (e.g., logout user)
        }
        return Promise.reject(error);
    }
);

export default API;
