import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '~/components';
import { ListResponse, http } from '~/http';
import { Exercise, Performance, Workout } from '~/types';
import { Button, Container, IconButton, Input, RadixDialog, Select } from '~/ui';
import { debounce } from '~/utils/debounce';
import { ExerciseForm, ExerciseFormData, ExerciseTable, PerformanceForm, PerformanceFormData } from '../../components';
import './ExerciseListRoute.scss';

export const ExerciseListRoute = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [workouts, setWorkouts] = React.useState<Workout[]>([]);
  const [searchInput, setSearchInput] = React.useState(searchParams.get('search') || '');
  const [selectedWorkout, setSelectedWorkout] = React.useState(searchParams.get('workout') || '');
  const [totalExercises, setTotalExercises] = React.useState(0);
  const [hasPreviousPage, setHasPreviousPage] = React.useState(false);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [exerciseDialogOpen, setExerciseDialogOpen] = React.useState(false);
  const [exerciseDialogInstance, setExerciseDialogInstance] = React.useState<Exercise | undefined>();
  const [performanceDialogOpen, setPerformanceDialogOpen] = React.useState(false);
  const [deleteExerciseDialogOpen, setDeleteExerciseDialogOpen] = React.useState(false);

  React.useEffect(() => {
    http
      .get<ListResponse<Exercise>>('/api/exercises/', {
        params: searchParams,
      })
      .then((exercises) => {
        setExercises(exercises.data.results);
        setTotalExercises(exercises.data.count);
        setHasPreviousPage(!!exercises.data.previous);
        setHasNextPage(!!exercises.data.next);
      });
    http.get<ListResponse<Workout>>('/api/workouts/').then((workouts) => {
      setWorkouts(workouts.data.results);
    });
  }, [searchParams]);

  const updateSearchParam = React.useCallback(
    debounce((name: string, value: string) => {
      if (name !== 'page') {
        searchParams.delete('page');
      }
      if (!value) {
        searchParams.delete(name);
      } else {
        searchParams.set(name, value);
      }
      setSearchParams(searchParams);
    }, 300),
    [searchParams, setSearchParams],
  );

  function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
    updateSearchParam('search', e.target.value);
  }

  function handleWorkoutSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedWorkout(e.target.value);
    updateSearchParam('workout', e.target.value);
  }

  function getPage() {
    return parseInt(searchParams.get('page') || '1', 10);
  }

  function setPage(page: number) {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  }

  function getTotalPages() {
    return Math.ceil(totalExercises / 20);
  }

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
    http.delete(`/api/exercises/${exerciseDialogInstance.id}/`).then(() => {
      setExercises((exercises) => exercises.filter((e) => e.id !== exerciseDialogInstance.id));
      setDeleteExerciseDialogOpen(false);
    });
  }

  function submitPerformanceForm(data: PerformanceFormData) {
    const { metrics, ...rest } = data;

    const performanceMetrics = Object.entries(metrics).map(([key, value]) => ({
      metric: key,
      value,
    }));

    http
      .post<Performance>('/api/performances/', {
        ...rest,
        metrics: performanceMetrics,
      })
      .then(() => {
        setPerformanceDialogOpen(false);
      });
  }

  return (
    <>
      <div className="ExerciseListRoute">
        <Container>
          <div className="ExerciseListRoute__header">
            <h2>Exercises</h2>
            <div className="ExerciseListRoute__header__actions">
              <Link to="/workouts">
                <Button variant="ghost">Manage Workouts</Button>
              </Link>
              <Button
                color="primary"
                onClick={() => {
                  setExerciseDialogInstance(undefined);
                  setExerciseDialogOpen(true);
                }}
                variant="raised"
              >
                Create Exercise
              </Button>
            </div>
          </div>
          <div className="ExerciseListRoute__filter">
            <Input
              id="search"
              label="Search"
              onChange={handleSearchInputChange}
              placeholder="Search exercises"
              value={searchInput}
            />
            <Select id="Workout" label="Workout" onChange={handleWorkoutSelectChange} value={selectedWorkout}>
              <option value="">All Workouts</option>
              {workouts.map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.name}
                </option>
              ))}
            </Select>
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
          {getTotalPages() > 1 && (
            <div className="flex justify-center my-8">
              <div className="Pagination">
                <IconButton disabled={!hasPreviousPage} onClick={() => setPage(getPage() - 1)}>
                  <span className="material-symbols-outlined">chevron_left</span>
                </IconButton>
                <p>
                  {getPage()} of {getTotalPages()}
                </p>
                <IconButton disabled={!hasNextPage} onClick={() => setPage(getPage() + 1)}>
                  <span className="material-symbols-outlined">chevron_right</span>
                </IconButton>
              </div>
            </div>
          )}
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
        <h2 className="mb-2">Log Performance</h2>
        <PerformanceForm exercise={exerciseDialogInstance} onSubmit={submitPerformanceForm} />
      </RadixDialog>
      <ConfirmDialog
        className="p-6"
        confirmLabel="Delete"
        danger
        message="Are you sure you want to delete this exercise?"
        onCancel={() => {
          setExerciseDialogInstance(undefined);
          setDeleteExerciseDialogOpen(false);
        }}
        onConfirm={confirmDeleteExercise}
        open={deleteExerciseDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setExerciseDialogInstance(undefined);
          }
          setDeleteExerciseDialogOpen(open);
        }}
        title="Delete Exercise"
      />
    </>
  );
};
