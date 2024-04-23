import { Card, Container } from '~/ui';
import { LoginForm } from '../../components';
import { Link } from 'react-router-dom';

export const LoginRoute = () => {
  return (
    <>
      <Container>
        <div className="centerPage">
          <Card>
            <h2 className="text-center mb-4">Login</h2>
            <LoginForm />
            <p className="mt-4">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </Card>
        </div>
      </Container>
    </>
  );
};
