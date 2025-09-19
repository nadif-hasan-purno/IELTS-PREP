import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    setTasks: (state, action) => {
      return action.payload;
    },
    updateTask: (state, action) => {
      const updatedTask = action.payload;
      const index = state.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...updatedTask };
      }
    },
    startTask: (state, action) => {
      const { taskId } = action.payload;
      const task = state.find((task) => task.id === taskId);
      if (task) {
        task.status = 'in-progress';
        task.startedAt = new Date().toISOString();
      }
    },
    pauseTask: (state, action) => {
      const { taskId, session } = action.payload;
      const task = state.find((task) => task.id === taskId);
      if (task) {
        task.status = 'in-progress';
        task.sessions.push(session);
        task.totalTime += session.duration;
      }
    },
    completeTask: (state, action) => {
      const { taskId, session } = action.payload;
      const task = state.find((task) => task.id === taskId);
      if (task) {
        task.status = 'completed';
        task.completedAt = new Date().toISOString();
        if (session) {
          task.sessions.push(session);
          task.totalTime += session.duration;
        }
      }
    },
    resetTask: (state, action) => {
      const { taskId } = action.payload;
      const task = state.find((task) => task.id === taskId);
      if (task) {
        task.status = 'not-started';
        task.startedAt = null;
        task.completedAt = null;
        task.sessions = [];
        task.totalTime = 0;
      }
    }
  },
});

export const { 
  setTasks, 
  updateTask, 
  startTask, 
  pauseTask, 
  completeTask, 
  resetTask 
} = tasksSlice.actions;
export default tasksSlice.reducer;
