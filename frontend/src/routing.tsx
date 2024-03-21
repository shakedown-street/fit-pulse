import { Navigate, RouteObject } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { ExerciseDetailRoute, ExerciseListRoute, HomeRoute, LoginRoute } from './routes';
import { useAuth } from './auth';

export type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

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
      {
        path: '/exercises',
        element: (
          <ProtectedRoute>
            <ExerciseListRoute />
          </ProtectedRoute>
        ),
      },
      {
        path: '/exercises/:id',
        element: (
          <ProtectedRoute>
            <ExerciseDetailRoute />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
