import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AppLayout.scss';
import { useAuth } from './auth';
import { Button, Container } from './ui';

export const AppLayout = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();

  function handleLogout() {
    logout().then(() => {
      setUser(undefined);
      navigate('/login');
    });
  }

  return (
    <>
      <nav className="shadow-md">
        <Container>
          <div className="flex align-center gap-4 py-2">
            <Link to="/">
              <h1>FitPulse</h1>
            </Link>
            <Link to="/exercises">
              <Button color="primary" size="sm">
                Exercises
              </Button>
            </Link>
            <div className="flex-1"></div>
            <div className="flex align-center gap-4">
              {user ? (
                <Button color="primary" onClick={handleLogout} size="sm" variant="ghost">
                  Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button color="primary" size="sm" variant="ghost">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Container>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};
