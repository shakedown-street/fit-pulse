import React from 'react';
import { ExerciseForm, ExerciseFormData, ExerciseTable, PerformanceForm, PerformanceFormData } from '~/exercises';
import { ListResponse, http } from '~/http';
import { Exercise, Performance } from '~/types';
import { Button, Container, RadixDialog } from '~/ui';
import './ExerciseListRoute.scss';

export const ExerciseListRoute = () => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [exerciseDialogOpen, setExerciseDialogOpen] = React.useState(false);
  const [exerciseDialogInstance, setExerciseDialogInstance] = React.useState<Exercise | undefined>();
  const [performanceDialogOpen, setPerformanceDialogOpen] = React.useState(false);
  const [deleteExerciseDialogOpen, setDeleteExerciseDialogOpen] = React.useState(false);

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

  function submitPerformanceForm(data: PerformanceFormData) {
    http.post<Performance>('/api/performances/', data).then((performance) => {
      setPerformanceDialogOpen(false);
      // update exercise since the performance_count has changed
      setExercises((exercises) => {
        const exercise = exercises.find((e) => e.id === performance.data.exercise.id);
        if (exercise) {
          return exercises.map((e) => (e.id === exercise.id ? performance.data.exercise : e));
        }
        return exercises;
      });
    });
  }

  return (
    <>
      <div className="ExerciseListRoute">
        <Container>
          <div className="ExerciseListRoute__header">
            <h2>Exercises</h2>
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
          </div>
          <ExerciseTable
            exercises={exercises}
            onCreatePerformance={(exercise) => {
              setExerciseDialogInstance(exercise);
              setPerformanceDialogOpen(true);
            }}
            onDelete={(exercise) => {
              setExerciseDialogInstance(exercise);
              setDeleteExerciseDialogOpen(true);
            }}
            onUpdate={(exercise) => {
              setExerciseDialogInstance(exercise);
              setExerciseDialogOpen(true);
            }}
          />
        </Container>
      </div>
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
        <h2 className="mb-2">{exerciseDialogInstance ? 'Edit' : 'Create'} Exercise</h2>
        <ExerciseForm instance={exerciseDialogInstance} onSubmit={submitExerciseForm} />
      </RadixDialog>
      <RadixDialog
        className="p-4"
        open={performanceDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setExerciseDialogInstance(undefined);
          }
          setPerformanceDialogOpen(open);
        }}
        style={{
          width: '320px',
        }}
      >
        <h2 className="mb-2">Create Performance</h2>
        <PerformanceForm exercise={exerciseDialogInstance} onSubmit={submitPerformanceForm} />
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
    </>
  );
};
