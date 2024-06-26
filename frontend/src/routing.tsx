import { Navigate, RouteObject } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { LoginRoute, ProfileRoute, SignUpRoute, useAuth } from './auth';
import { DietRoute, FoodListRoute } from './diet';
import { ExerciseDetailRoute, ExerciseListRoute, WorkoutListRoute } from './exercises';

export type RouteGuard = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: RouteGuard) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: RouteGuard) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/login',
        element: (
          <PublicRoute>
            <LoginRoute />
          </PublicRoute>
        ),
      },
      {
        path: '/signup',
        element: (
          <PublicRoute>
            <SignUpRoute />
          </PublicRoute>
        ),
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
        path: '/',
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
      {
        path: '/workouts',
        element: (
          <ProtectedRoute>
            <WorkoutListRoute />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
