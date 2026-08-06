import axios from "axios";

const PUBLIC_PATHS = ["/", "/login", "/register"];

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !PUBLIC_PATHS.includes(window.location.pathname)) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
