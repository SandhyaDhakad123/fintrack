import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://fintrack-pb21.onrender.com';

// Request interceptor: Add token to all requests automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle expired tokens
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('fintrack_refresh_token');
      
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
          const { access_token, refresh_token } = res.data;
          
          localStorage.setItem('fintrack_token', access_token);
          localStorage.setItem('fintrack_refresh_token', refresh_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh token also failed/expired
          localStorage.removeItem('fintrack_token');
          localStorage.removeItem('fintrack_refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};

export const registerUser = async (name, email, password) => {
  const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return res.data;
};

export const getMe = async () => {
  const res = await axios.get(`${API_URL}/auth/me`);
  return res.data;
};

// ─── Transactions ─────────────────────────────────────────────
export const addTransaction = async (data) => {
    const res = await axios.post(`${API_URL}/transactions/`, data);
    return res.data;
};
export const getTransactions = async (params = {}) => {
    const res = await axios.get(`${API_URL}/transactions/`, { params });
    return res.data;
};
export const deleteTransaction = async (id) => {
    await axios.delete(`${API_URL}/transactions/${id}`);
};

// ─── Weekly & Monthly Reports ────────────────────────────────────
export const getWeeklyReport = async () => {
    const res = await axios.get(`${API_URL}/report/weekly/`);
    return res.data;
};

export const getMonthlyReport = async () => {
    const res = await axios.get(`${API_URL}/report/monthly/`);
    return res.data;
};

export const getMonthlySummary = async (month, year) => {
    const res = await axios.get(`${API_URL}/report/summary`, { params: { month, year } });
    return res.data;
};

// ─── Budgets ───────────────────────────────────────────────────
export const getBudgets = async (month, year) => {
    const res = await axios.get(`${API_URL}/budgets/`, { params: { month, year } });
    return res.data;
};
export const createBudget = async (data) => {
    const res = await axios.post(`${API_URL}/budgets/`, data);
    return res.data;
};

// ─── Goals ────────────────────────────────────────────────────
export const getGoals = async () => {
    const res = await axios.get(`${API_URL}/goals/`);
    return res.data;
};
export const createGoal = async (data) => {
    const res = await axios.post(`${API_URL}/goals/`, data);
    return res.data;
};
export const updateGoal = async (id, data) => {
    const res = await axios.put(`${API_URL}/goals/${id}`, data);
    return res.data;
};
export const deleteGoal = async (id) => {
    await axios.delete(`${API_URL}/goals/${id}`);
};
