import { Card, Container } from '~/ui';
import { LoginForm } from '../../components';

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
