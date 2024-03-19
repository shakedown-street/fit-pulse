import { RouteObject } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { HomeRoute, LoginRoute } from './routes';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <HomeRoute />,
      },
      {
        path: '/login',
        element: <LoginRoute />,
      },
    ],
  },
];
