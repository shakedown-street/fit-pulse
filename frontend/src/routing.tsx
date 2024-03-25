import { Navigate, RouteObject } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { useAuth } from './auth';
import {
  DietRoute,
  ExerciseDetailRoute,
  ExerciseListRoute,
  FoodListRoute,
  HomeRoute,
  LoginRoute,
  ProfileRoute,
  SignUpRoute,
} from './routes';

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
        path: '/signup',
        element: <SignUpRoute />,
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfileRoute />
          </ProtectedRoute>
        ),
      },
      {
        path: '/diet',
        element: (
          <ProtectedRoute>
            <DietRoute />
          </ProtectedRoute>
        ),
      },
      {
        path: '/diet/foods',
        element: (
          <ProtectedRoute>
            <FoodListRoute />
          </ProtectedRoute>
        ),
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
