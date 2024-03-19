import React from 'react';
import { useForm } from 'react-hook-form';
import { ListResponse, http } from '~/http';
import { Button, Input } from '~/ui';
import { Exercise } from './Exercise';
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

  React.useEffect(() => {
    http.get<ListResponse<Exercise>>('/api/exercises/').then((exercises) => {
      setExercises(exercises.data.results);
    });
  }, []);

  return (
    <form className="ProgressForm" onSubmit={progressForm.handleSubmit(onSubmit)}>
      <div className="Input__container Input__container--fluid">
        <label className="Input__label" htmlFor="exercise">
          Exercise
        </label>
        <select className="Input Input--fluid" id="exercise" {...progressForm.register('exercise', { required: true })}>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>
      <Input fluid id="date" label="Date" type="date" {...progressForm.register('date', { required: true })} />
      <Input
        fluid
        id="value"
        label="Value"
        step="0.01"
        type="number"
        {...progressForm.register('value', { required: true })}
      />
      <Button color="primary" disabled={!progressForm.formState.isValid} fluid type="submit" variant="raised">
        Submit
      </Button>
    </form>
  );
};
