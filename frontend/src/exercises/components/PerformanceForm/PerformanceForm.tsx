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
  metrics: any;
};

export const PerformanceForm = ({ exercise, instance, onSubmit }: PerformanceFormProps) => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);

  const performanceForm = useForm<PerformanceFormData>({
    defaultValues: {
      date: instance ? instance.date : format(new Date(), 'yyyy-MM-dd'),
      metrics: instance
        ? instance.metrics.reduce((acc, metric) => ({ ...acc, [metric.metric.id]: metric.value }), {})
        : {},
    },
  });

  const selectedExercise = exercises.find((exercise) => exercise.id === performanceForm.watch('exercise'));

  React.useEffect(() => {
    http.get<ListResponse<Exercise>>('/api/exercises/').then((exercises) => {
      setExercises(exercises.data.results);
      if (instance) {
        performanceForm.setValue('exercise', instance.exercise.id);
      } else if (exercise) {
        performanceForm.setValue('exercise', exercise.id);
      }
    });
  }, []);

  return (
    <form className="PerformanceForm" onSubmit={performanceForm.handleSubmit((data) => onSubmit(data, instance))}>
      {!!instance || !!exercise ? (
        <>
          <div>
            <label className="Input__label">Exercise</label>
            <b>{selectedExercise?.name}</b>
          </div>
        </>
      ) : (
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
      )}
      <Input fluid id="date" label="Date" type="date" {...performanceForm.register('date', { required: true })} />
      {selectedExercise?.metrics.map((metric) => {
        return (
          <Input
            key={metric.id}
            fluid
            id={metric.name}
            label={metric.name}
            type="number"
            {...performanceForm.register(`metrics.${metric.id}`, { required: true })}
          />
        );
      })}
      <Button color="primary" disabled={!performanceForm.formState.isValid} fluid type="submit" variant="raised">
        Save
      </Button>
    </form>
  );
};
