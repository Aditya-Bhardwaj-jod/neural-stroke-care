import axios from "axios";

const api = axios.create({
    baseURL: "https://neurocare-backend-1f3t.onrender.com/api",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401 → auto logout
api.interceptors.response.use(
    (res) => res,
    async(err) => {
        if (err.response ? .status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default api;