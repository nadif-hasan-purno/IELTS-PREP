import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tasksReducer from './tasksSlice';

const appStore = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer,
  },
});

export default appStore;
