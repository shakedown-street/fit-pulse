import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProvider } from './AppProvider';
import { routes } from './routing';

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>,
);
