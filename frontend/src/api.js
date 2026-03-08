import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Add token to all requests automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
