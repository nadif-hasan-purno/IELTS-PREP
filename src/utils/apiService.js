import axios from 'axios';
import { BASE_URL } from './constants';

// Create a configured axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Progress API calls
export const progressAPI = {
  getProgress: async () => {
    try {
      const response = await api.get('/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  },

  startSession: async (taskId, module) => {
    try {
      const response = await api.post(`/progress/${taskId}/start`, { module });
      return response.data;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  },

  completeSession: async (taskId, duration) => {
    try {
      const response = await api.patch(`/progress/${taskId}/complete`, { duration });
      return response.data;
    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      const response = await api.patch(`/progress/${taskId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  migrateTasks: async (tasks) => {
    try {
      const response = await api.post('/progress/migrate', { tasks });
      return response.data;
    } catch (error) {
      console.error('Error migrating tasks:', error);
      throw error;
    }
  },
};

// Tasks API calls
export const tasksAPI = {
  getTasks: async () => {
    try {
      const response = await api.get('/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks from API:', error);
      throw error;
    }
  },
};
