import React from 'react';
import { useForm } from 'react-hook-form';
import { ListResponse, http } from '~/http';
import { Exercise, Workout } from '~/types';
import { Button, Input, Select } from '~/ui';
import './WorkoutForm.scss';

export type WorkoutFormProps = {
  instance?: Workout;
  onSubmit: (data: WorkoutFormData, instance?: Workout) => void;
};

export type WorkoutFormData = {
  name: string;
  exercises: string[];
};

export const WorkoutForm = ({ instance, onSubmit }: WorkoutFormProps) => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [loading, setLoading] = React.useState(false);
  const workoutForm = useForm<WorkoutFormData>({
    defaultValues: {
      name: instance ? instance.name : '',
      exercises: instance ? instance.exercises : [],
    },
  });

  React.useEffect(() => {
    setLoading(true);
    http
      .get<ListResponse<Exercise>>('/api/exercises/', {
        params: {
          page_size: 1000,
        },
      })
      .then((exercises) => {
        setExercises(exercises.data.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form className="WorkoutForm" onSubmit={workoutForm.handleSubmit((data) => onSubmit(data, instance))}>
      <Input fluid id="name" label="Name" {...workoutForm.register('name', { required: true })} />
      <Select
        fluid
        hint={<>Hold down "Control" to select more than one.</>}
        id="exercises"
        label="Exercises"
        multiple
        {...workoutForm.register('exercises', { required: true })}
      >
        {exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name}
          </option>
        ))}
      </Select>
      <Button color="primary" disabled={!workoutForm.formState.isValid} fluid type="submit" variant="raised">
        Save
      </Button>
    </form>
  );
};
