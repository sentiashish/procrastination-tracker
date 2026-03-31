import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
};

export const taskApi = {
  createTask: (payload) => api.post("/tasks/create", payload),
  getTasks: () => api.get("/tasks"),
  startTask: (id) => api.put(`/tasks/start/${id}`),
  endTask: (id) => api.put(`/tasks/end/${id}`),
};

export const activityApi = {
  addActivity: (payload) => api.post("/activity/add", payload),
  getActivities: () => api.get("/activity"),
};

export const reportApi = {
  getWeeklyReport: () => api.get("/reports/weekly"),
};

export default api;
