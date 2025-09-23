import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Body from './components/Body';
import Dashboard from './components/Dashboard';
import ModuleView from './components/ModuleView';
import Login from './components/Login';
import UserProfile from './components/UserProfile';

import { fetchTasks } from './utils/tasksSlice';
import { progressAPI } from './utils/apiService';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Body />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/module/:id',
        element: <ModuleView />,
      },
      {
        path: '/profile',
        element: <UserProfile />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const migrateAndFetchTasks = async () => {
      const localTasksState = localStorage.getItem('tasksState');

      if (localTasksState) {
        try {
          const tasks = JSON.parse(localTasksState);
          console.log("Migrating local tasks to backend:", tasks);
          await progressAPI.migrateTasks(tasks.tasks); // Assuming tasks.tasks holds the array
          localStorage.removeItem('tasksState'); // Clear local storage after successful migration
          console.log("Local tasks migrated successfully.");
        } catch (error) {
          console.error("Error during task migration:", error);
          // Even if migration fails, try to fetch from backend
        }
      }
      
      // Always fetch tasks from the backend after potential migration
      dispatch(fetchTasks());
    };

    migrateAndFetchTasks();
  }, [dispatch]);

  return (
    <>
      <Toaster />
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;