import React from 'react';
import { useForm } from 'react-hook-form';
import { ListResponse, http } from '~/http';
import { Exercise } from '~/types';
import { Button, Input } from '~/ui';
import './ProgressForm.scss';

export type ProgressFormProps = {
  onSubmit: (data: ProgressFormData) => void;
};

export type ProgressFormData = {
  exercise: string;
  date: string;
  value: number;
};

export const ProgressForm = ({ onSubmit }: ProgressFormProps) => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);

  const progressForm = useForm<ProgressFormData>();

  const selectedExercise = exercises.find((exercise) => exercise.id === progressForm.watch('exercise'));

  React.useEffect(() => {
    http.get<ListResponse<Exercise>>('/api/exercises/').then((exercises) => {
      setExercises(exercises.data.results);
    });
  }, []);

  function getExerciseValueLabel(exercise: Exercise) {
    switch (exercise.value_type) {
      case 'weight':
        return 'Weight (lbs)';
      case 'reps':
        return 'Reps';
      case 'time':
        return 'Time (seconds)';
      case 'bpm':
        return 'BPM';
    }
  }

  return (
    <form className="ProgressForm" onSubmit={progressForm.handleSubmit(onSubmit)}>
      <Input fluid id="date" label="Date" type="date" {...progressForm.register('date', { required: true })} />
      <div className="Input__container Input__container--fluid">
        <label className="Input__label" htmlFor="exercise">
          Exercise
        </label>
        <select className="Input Input--fluid" id="exercise" {...progressForm.register('exercise', { required: true })}>
          <option value=""></option>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>
      {selectedExercise && (
        <Input
          fluid
          id="value"
          label={getExerciseValueLabel(selectedExercise)}
          step="1"
          type="number"
          {...progressForm.register('value', { required: true })}
        />
      )}
      <Button color="primary" disabled={!progressForm.formState.isValid} fluid type="submit" variant="raised">
        Submit
      </Button>
    </form>
  );
};
