import { format } from 'date-fns';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ListResponse, http } from '~/http';
import { Exercise, Performance } from '~/types';
import { Button, Input, Select } from '~/ui';
import './PerformanceForm.scss';

export type PerformanceFormProps = {
  exercise?: Exercise;
  instance?: Performance;
  onSubmit: (data: PerformanceFormData, instance?: Performance) => void;
};

export type PerformanceFormData = {
  exercise: string;
  date: string;
  value: number;
};

export const PerformanceForm = ({ exercise, instance, onSubmit }: PerformanceFormProps) => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);

  const performanceForm = useForm<PerformanceFormData>({
    defaultValues: {
      date: instance ? format(instance.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      value: instance ? instance.value : undefined,
    },
  });

  const selectedExercise = exercises.find((exercise) => exercise.id === performanceForm.watch('exercise'));

  React.useEffect(() => {
    http.get<ListResponse<Exercise>>('/api/exercises/').then((exercises) => {
      setExercises(exercises.data.results);
    });
  }, []);

  React.useEffect(() => {
    if (instance) {
      performanceForm.setValue('exercise', instance.exercise.id);
    } else if (exercise) {
      performanceForm.setValue('exercise', exercise.id);
    }
  }, [exercises]);

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
    <form className="PerformanceForm" onSubmit={performanceForm.handleSubmit((data) => onSubmit(data, instance))}>
      <Select
        disabled={!!instance || !!exercise}
        fluid
        id="exercise"
        label="Exercise"
        {...performanceForm.register('exercise', { required: true })}
      >
        <option value=""></option>
        {exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name}
          </option>
        ))}
      </Select>
      <Input fluid id="date" label="Date" type="date" {...performanceForm.register('date', { required: true })} />
      {selectedExercise && (
        <Input
          fluid
          id="value"
          label={getExerciseValueLabel(selectedExercise)}
          step="1"
          type="number"
          {...performanceForm.register('value', { required: true })}
        />
      )}
      <Button color="primary" disabled={!performanceForm.formState.isValid} fluid type="submit" variant="raised">
        Save
      </Button>
    </form>
  );
};
