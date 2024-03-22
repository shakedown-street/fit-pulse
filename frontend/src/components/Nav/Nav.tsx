import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '~/auth';
import { Button, Container, IconButton } from '~/ui';
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
          {user && (
            <Link to="/exercises">
              <Button color="primary" size="sm">
                Exercises
              </Button>
            </Link>
          )}
          <div className="Nav__spacer"></div>
          {user ? (
            <>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <IconButton>
                    <span className="material-symbols-outlined">menu</span>
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" className="DropdownMenu__content">
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => navigate('/profile')}>
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      Profile
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => logout()}>
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">logout</span>
                      </div>
                      Logout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </>
          ) : (
            <>
              <Link to="/signup">
                <Button color="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button color="primary" size="sm" variant="raised">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </Container>
    </nav>
  );
};
