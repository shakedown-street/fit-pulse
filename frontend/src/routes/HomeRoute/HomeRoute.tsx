import { Link } from 'react-router-dom';
import { Container } from '~/ui';

export const HomeRoute = () => {
  return (
    <>
      <Container>
        <div className="my-8">
          <h2 className="my-4">Welcome to FitPulse</h2>
          <p style={{ maxWidth: '768px' }}>
            To get started, <Link to="/login">login</Link> and navigate to the <Link to="/exercises">exercises</Link>{' '}
            page. From there you can add exercises you want to begin tracking your improvement on. Once you have added
            some exercises, you can begin logging your performances on those exercises. You can view your performances
            on an exercise by clicking into the exercise and viewing the performance log. Your performance log will show
            you how much you have improved on the exercise over time.
          </p>
        </div>
      </Container>
    </>
  );
};
