import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '~/components';
import { ListResponse, http } from '~/http';
import { Workout } from '~/types';
import { Button, Container, IconButton, Input, RadixDialog } from '~/ui';
import { debounce } from '~/utils/debounce';
import { WorkoutForm, WorkoutFormData, WorkoutTable } from '../../components';
import './WorkoutListRoute.scss';

export const WorkoutListRoute = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workouts, setWorkouts] = React.useState<Workout[]>([]);
  const [searchInput, setSearchInput] = React.useState(searchParams.get('search') || '');
  const [totalWorkouts, setTotalWorkouts] = React.useState(0);
  const [hasPreviousPage, setHasPreviousPage] = React.useState(false);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [workoutDialogOpen, setWorkoutDialogOpen] = React.useState(false);
  const [workoutDialogInstance, setWorkoutDialogInstance] = React.useState<Workout | undefined>();
  const [deleteWorkoutDialogOpen, setDeleteWorkoutDialogOpen] = React.useState(false);

  React.useEffect(() => {
    http
      .get<ListResponse<Workout>>('/api/workouts/', {
        params: searchParams,
      })
      .then((workouts) => {
        setWorkouts(workouts.data.results);
        setTotalWorkouts(workouts.data.count);
        setHasPreviousPage(!!workouts.data.previous);
        setHasNextPage(!!workouts.data.next);
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

  function getPage() {
    return parseInt(searchParams.get('page') || '1', 10);
  }

  function setPage(page: number) {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  }

  function getTotalPages() {
    return Math.ceil(totalWorkouts / 20);
  }

  function submitWorkoutForm(data: WorkoutFormData, instance?: Workout) {
    if (instance) {
      http.patch<Workout>(`/api/workouts/${instance.id}/`, data).then((workout) => {
        setWorkouts((workouts) => workouts.map((e) => (e.id === workout.data.id ? workout.data : e)));
        setWorkoutDialogOpen(false);
      });
    } else {
      http.post<Workout>('/api/workouts/', data).then((workout) => {
        setWorkouts((workouts) => [...workouts, workout.data]);
        setWorkoutDialogOpen(false);
      });
    }
  }

  function confirmDeleteWorkout() {
    if (!workoutDialogInstance) {
      return;
    }
    http.delete(`/api/workouts/${workoutDialogInstance.id}/`).then(() => {
      setWorkouts((workouts) => workouts.filter((e) => e.id !== workoutDialogInstance.id));
      setDeleteWorkoutDialogOpen(false);
    });
  }

  return (
    <>
      <div className="WorkoutListRoute">
        <Container>
          <div className="WorkoutListRoute__header">
            <div className="WorkoutListRoute__header__title">
              <Link to="/exercises" title="Back to exercises">
                <IconButton>
                  <span className="material-symbols-outlined">arrow_back</span>
                </IconButton>
              </Link>
              <h2>Workouts</h2>
            </div>
            <div className="WorkoutListRoute__header__actions">
              <Button
                color="primary"
                onClick={() => {
                  setWorkoutDialogInstance(undefined);
                  setWorkoutDialogOpen(true);
                }}
                variant="raised"
              >
                Create Workout
              </Button>
            </div>
          </div>
          <div className="WorkoutListRoute__filter">
            <Input
              id="search"
              label="Search"
              onChange={handleSearchInputChange}
              placeholder="Search workouts"
              value={searchInput}
            />
          </div>
          <WorkoutTable
            workouts={workouts}
            onDelete={(workout) => {
              setWorkoutDialogInstance(workout);
              setDeleteWorkoutDialogOpen(true);
            }}
            onUpdate={(workout) => {
              setWorkoutDialogInstance(workout);
              setWorkoutDialogOpen(true);
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
        open={workoutDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setWorkoutDialogInstance(undefined);
          }
          setWorkoutDialogOpen(open);
        }}
        style={{
          width: '320px',
        }}
      >
        <h2 className="mb-2">{workoutDialogInstance ? 'Edit' : 'Create'} Workout</h2>
        <WorkoutForm instance={workoutDialogInstance} onSubmit={submitWorkoutForm} />
      </RadixDialog>
      <ConfirmDialog
        className="p-6"
        confirmLabel="Delete"
        danger
        message="Are you sure you want to delete this workout?"
        onCancel={() => {
          setWorkoutDialogInstance(undefined);
          setDeleteWorkoutDialogOpen(false);
        }}
        onConfirm={confirmDeleteWorkout}
        open={deleteWorkoutDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setWorkoutDialogInstance(undefined);
          }
          setDeleteWorkoutDialogOpen(open);
        }}
        title="Delete Workout"
      />
    </>
  );
};
