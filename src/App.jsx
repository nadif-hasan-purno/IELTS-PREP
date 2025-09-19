import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import appStore from './utils/appStore';
import Body from './components/Body';
import Dashboard from './components/Dashboard';
import ModuleView from './components/ModuleView';

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
    ],
  },
]);

function App() {
  return (
    <Provider store={appStore}>
      <Toaster />
      <RouterProvider router={appRouter} />
    </Provider>
  );
}

export default App;
