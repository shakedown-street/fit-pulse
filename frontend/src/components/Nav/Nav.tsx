import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '~/auth';
import { Button, Container } from '~/ui';
import './Nav.scss';

export const Nav = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();

  function handleLogout() {
    logout().then(() => {
      setUser(undefined);
      navigate('/login');
    });
  }

  return (
    <nav className="Nav">
      <Container>
        <div className="Nav__content">
          <Link to="/">
            <h1>FitPulse</h1>
          </Link>
          <Link to="/exercises">
            <Button color="primary" size="sm">
              Exercises
            </Button>
          </Link>
          <div className="Nav__spacer"></div>
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
      </Container>
    </nav>
  );
};