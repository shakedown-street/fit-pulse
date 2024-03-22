import { LoginForm } from '~/auth';
import { Card, Container } from '~/ui';

export const LoginRoute = () => {
  return (
    <>
      <Container>
        <div className="centerPage">
          <Card>
            <h2 className="text-center mb-4">Login</h2>
            <LoginForm />
          </Card>
        </div>
      </Container>
    </>
  );
};
