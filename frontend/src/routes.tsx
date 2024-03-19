import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { LoginRoute, useAuth } from './auth';
import {
  Exercise,
  ExerciseForm,
  ExerciseFormData,
  ExerciseTable,
  Progress,
  ProgressForm,
  ProgressFormData,
} from './exercises';
import { ListResponse, http } from './http';
import { Button, Container, RadixDialog } from './ui';

const Home = () => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [exerciseDialogOpen, setExerciseDialogOpen] = React.useState(false);
  const [exerciseDialogInstance, setExerciseDialogInstance] = React.useState<Exercise | undefined>();
  const [progressDialogOpen, setProgressDialogOpen] = React.useState(false);
  const [deleteExerciseDialogOpen, setDeleteExerciseDialogOpen] = React.useState(false);

  const { user } = useAuth();

  React.useEffect(() => {
    http.get<ListResponse<Exercise>>('/api/exercises').then((exercises) => setExercises(exercises.data.results));
  }, []);

  function submitExerciseForm(data: ExerciseFormData, instance?: Exercise) {
    if (instance) {
      http.patch<Exercise>(`/api/exercises/${instance.id}/`, data).then((exercise) => {
        setExercises((exercises) => exercises.map((e) => (e.id === exercise.data.id ? exercise.data : e)));
        setExerciseDialogOpen(false);
      });
    } else {
      http.post<Exercise>('/api/exercises/', data).then((exercise) => {
        setExercises((exercises) => [...exercises, exercise.data]);
        setExerciseDialogOpen(false);
      });
    }
  }

  function confirmDeleteExercise() {
    if (!exerciseDialogInstance) {
      return;
    }
    http.delete(`/api/exercises/${exerciseDialogInstance.id}`).then(() => {
      setExercises((exercises) => exercises.filter((e) => e.id !== exerciseDialogInstance.id));
      setDeleteExerciseDialogOpen(false);
    });
  }

  function submitProgressForm(data: ProgressFormData) {
    http.post<Progress>('/api/progress/', data).then((progress) => {
      setProgressDialogOpen(false);
      // update exercise since the progress_count has changed
      setExercises((exercises) => {
        const exercise = exercises.find((e) => e.id === progress.data.exercise.id);
        if (exercise) {
          return exercises.map((e) => (e.id === exercise.id ? progress.data.exercise : e));
        }
        return exercises;
      });
    });
  }

  return (
    <>
      <Container>
        <h1>Home</h1>
        <ExerciseTable
          exercises={exercises}
          onDelete={(exercise) => {
            setExerciseDialogInstance(exercise);
            setDeleteExerciseDialogOpen(true);
          }}
          onUpdate={(exercise) => {
            setExerciseDialogInstance(exercise);
            setExerciseDialogOpen(true);
          }}
        />
        {user && (
          <div className="flex gap-2">
            <Button
              color="primary"
              onClick={() => {
                setExerciseDialogInstance(undefined);
                setExerciseDialogOpen(true);
              }}
              variant="ghost"
            >
              Create Exercise
            </Button>
            <Button color="primary" onClick={() => setProgressDialogOpen(true)} variant="ghost">
              Track Progress
            </Button>
          </div>
        )}
        <RadixDialog
          className="p-4"
          open={exerciseDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setExerciseDialogInstance(undefined);
            }
            setExerciseDialogOpen(open);
          }}
          style={{
            width: '320px',
          }}
        >
          <h2 className="mb-2">{exerciseDialogInstance ? 'Update' : 'Create'} Exercise</h2>
          <ExerciseForm instance={exerciseDialogInstance} onSubmit={submitExerciseForm} />
        </RadixDialog>
        <RadixDialog
          className="p-4"
          open={progressDialogOpen}
          onOpenChange={setProgressDialogOpen}
          style={{
            width: '320px',
          }}
        >
          <h2 className="mb-2">Track Progress</h2>
          <ProgressForm onSubmit={submitProgressForm} />
        </RadixDialog>
        <RadixDialog
          className="p-4"
          open={deleteExerciseDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setExerciseDialogInstance(undefined);
            }
            setDeleteExerciseDialogOpen(open);
          }}
        >
          <h2 className="mb-2">Delete Exercise</h2>
          <p>Are you sure you want to delete this exercise?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => {
                setExerciseDialogInstance(undefined);
                setDeleteExerciseDialogOpen(false);
              }}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button color="red" onClick={confirmDeleteExercise} variant="ghost">
              Delete
            </Button>
          </div>
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
