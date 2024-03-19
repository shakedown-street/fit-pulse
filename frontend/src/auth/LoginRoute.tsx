import { Card, Container } from '~/ui';
import { LoginForm } from './LoginForm';

export const LoginRoute = () => {
  return (
    <Container>
      <div className="centerPage">
        <Card>
          <h1 className="text-center mb-4">Login</h1>
          <LoginForm />
        </Card>
      </div>
    </Container>
  );
};
