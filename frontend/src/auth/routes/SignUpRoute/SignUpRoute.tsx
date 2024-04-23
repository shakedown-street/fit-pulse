import { Card, Container } from '~/ui';
import { SignUpForm } from '../../components';
import { Link } from 'react-router-dom';

export const SignUpRoute = () => {
  return (
    <>
      <Container>
        <div className="centerPage">
          <Card>
            <h2 className="text-center mb-4">Sign Up</h2>
            <SignUpForm />
            <p className="mt-4">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </Card>
        </div>
      </Container>
    </>
  );
};
