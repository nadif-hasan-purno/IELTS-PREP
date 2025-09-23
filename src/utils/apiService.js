import axios from 'axios';
import { BASE_URL } from './constants';

// Progress API calls
export const progressAPI = {
  // Get user progress - this endpoint might not exist, using tasks instead
  getProgress: async () => {
    try {
      // Try to get progress summary if available, otherwise use tasks
      const response = await axios.get(`${BASE_URL}/progress`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  },

  // Start a study session
  startSession: async (taskId, module) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/progress/${taskId}/start`,
        { module },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  },

  // Complete a study session
  completeSession: async (taskId, duration) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/progress/${taskId}/complete`,
        { duration },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  },

  // Update task progress
  updateTask: async (taskId, updates) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/progress/${taskId}`,
        updates,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // New function to migrate local tasks to the backend
  migrateTasks: async (tasks) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/progress/migrate`,
        { tasks },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('Error migrating tasks:', error);
      throw error;
    }
  }
};

// Tasks API calls
export const tasksAPI = {
  // Get all tasks from the backend
  getTasks: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/progress`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks from API:', error);
      throw error; // Re-throw the error so the calling thunk can handle it
    }
  },
};