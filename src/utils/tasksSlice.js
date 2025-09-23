import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { progressAPI, tasksAPI } from "./apiService";
import { getAllTasks } from '../data/syllabusData'; // Keep this for fallback

// Async thunks for API calls
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await tasksAPI.getTasks();
      // If backend returns no tasks, initialize from syllabus
      if (!response.tasks || response.tasks.length === 0) {
        const allTasks = getAllTasks();
        return {
          tasks: allTasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            module: task.id.split('-')[0],
            status: 'not-started',
            totalTime: 0,
            sessions: [],
            completedAt: null,
            startedAt: null,
            estimatedTime: task.estimatedTime,
            subtopics: task.subtopics,
            resources: task.resources
          }))
        };
      }
      return response;
    } catch (error) {
      console.error("Failed to fetch tasks from API, falling back to syllabus:", error);
      // Fallback to local syllabus data if API call fails
      const allTasks = getAllTasks();
      return {
        tasks: allTasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          module: task.id.split('-')[0],
          status: 'not-started',
          totalTime: 0,
          sessions: [],
          completedAt: null,
          startedAt: null,
          estimatedTime: task.estimatedTime,
          subtopics: task.subtopics,
          resources: task.resources
        }))
      };
    }
  }
);

export const startTaskSession = createAsyncThunk(
  "tasks/startTaskSession",
  async ({ taskId, module }, { rejectWithValue }) => {
    try {
      const response = await progressAPI.startSession(taskId, module);
      return response.task || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to start task session");
    }
  }
);

export const completeTaskSession = createAsyncThunk(
  "tasks/completeTaskSession",
  async ({ taskId, duration }, { rejectWithValue }) => {
    try {
      const response = await progressAPI.completeSession(taskId, duration);
      return response.task || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to complete task session");
    }
  }
);

export const updateTaskProgress = createAsyncThunk(
  "tasks/updateTaskProgress",
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const response = await progressAPI.updateTask(taskId, updates);
      return response.task || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update task progress");
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Start task session
      .addCase(startTaskSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startTaskSession.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload.progress; // Extract the 'progress' object
        const index = state.tasks.findIndex((task) => task.id === updatedTask.taskId); // Use taskId for lookup
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...updatedTask };
        }
      })
      .addCase(startTaskSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Complete task session
      .addCase(completeTaskSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeTaskSession.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload.progress; // Extract the 'progress' object
        const index = state.tasks.findIndex((task) => task.id === updatedTask.taskId); // Use taskId for lookup
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...updatedTask };
        }
      })
      .addCase(completeTaskSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update task progress
      .addCase(updateTaskProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskProgress.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload.progress; // Extract the 'progress' object
        const index = state.tasks.findIndex((task) => task.id === updatedTask.taskId); // Use taskId for lookup
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...updatedTask };
        }
      })
      .addCase(updateTaskProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setTasks, 
  clearError 
} = tasksSlice.actions;
export default tasksSlice.reducer;