import { SignUpForm } from '~/auth';
import { Card, Container } from '~/ui';

export const SignUpRoute = () => {
  return (
    <Container>
      <div className="centerPage">
        <Card>
          <h2 className="text-center mb-4">Sign Up</h2>
          <SignUpForm />
        </Card>
      </div>
    </Container>
  );
};
