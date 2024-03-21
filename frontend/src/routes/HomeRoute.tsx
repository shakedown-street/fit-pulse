import { Container } from '~/ui';

export const HomeRoute = () => {
  return (
    <>
      <Container>
        <div className="my-8">
          <h1>Fit Pulse</h1>
          <h4 className="my-4">Welcome to FitPulse</h4>
          <p style={{ maxWidth: '768px' }}>
            To get started, log in and click "Exercises" at the top of the page. From there you can add exercises you
            want to begin tracking your improvement on. Once you have added some exercises, you can being logging your
            performances on those exercises. You can view your performances on an exercise by clicking into the exercise
            and viewing the performance log. Your performance log will show you how much you have improved on the
            exercise over time.
          </p>
        </div>
      </Container>
    </>
  );
};
