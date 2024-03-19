import { RouteObject } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { LoginRoute, useAuth } from './auth';
import { Container } from './ui';

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <Container>
        <h1>Home</h1>
        {user && <p>Welcome, {user.username}</p>}
      </Container>
    </>
  );
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <LoginRoute />,
      },
    ],
  },
];
