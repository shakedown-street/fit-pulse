import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { LoginRoute, useAuth } from './auth';
import { ExerciseForm, ExerciseFormData, ProgressForm, ProgressFormData } from './exercises';
import { http } from './http';
import { Button, Container, RadixDialog } from './ui';

const Home = () => {
  const [exerciseDialogOpen, setExerciseDialogOpen] = React.useState(false);
  const [progressDialogOpen, setProgressDialogOpen] = React.useState(false);

  const { user } = useAuth();

  function submitExerciseForm(data: ExerciseFormData) {
    http.post('/api/exercises/', data).then(() => {
      setExerciseDialogOpen(false);
    });
  }

  function submitProgressForm(data: ProgressFormData) {
    http.post('/api/exercises/', data).then(() => {
      setProgressDialogOpen(false);
    });
  }

  return (
    <>
      <Container>
        <h1>Home</h1>
        {user && (
          <div className="flex gap-2">
            <Button color="primary" onClick={() => setExerciseDialogOpen(true)} variant="ghost">
              Create Exercise
            </Button>
            <Button color="primary" onClick={() => setProgressDialogOpen(true)} variant="ghost">
              Track Progress
            </Button>
          </div>
        )}
        <RadixDialog className="p-4" open={exerciseDialogOpen} onOpenChange={setExerciseDialogOpen}>
          <h2 className="mb-2">Create Exercise</h2>
          <ExerciseForm onSubmit={submitExerciseForm} />
        </RadixDialog>
        <RadixDialog className="p-4" open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
          <h2 className="mb-2">Track Progress</h2>
          <ProgressForm onSubmit={submitProgressForm} />
        </RadixDialog>
      </Container>
    </>
  );
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <LoginRoute />,
      },
    ],
  },
];
