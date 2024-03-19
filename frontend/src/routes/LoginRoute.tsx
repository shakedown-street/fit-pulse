import { LoginForm } from '~/auth';
import { Card, Container } from '~/ui';

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
