import { RouteObject } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { ExerciseDetailRoute, ExerciseListRoute, HomeRoute, LoginRoute } from './routes';

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
        path: '/exercises',
        element: <ExerciseListRoute />,
      },
      {
        path: '/exercises/:id',
        element: <ExerciseDetailRoute />,
      },
      {
        path: '/login',
        element: <LoginRoute />,
      },
    ],
  },
];
