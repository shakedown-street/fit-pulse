import { format } from 'date-fns';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ListResponse, http } from '~/http';
import { Exercise, Performance } from '~/types';
import { Button, Input, Select } from '~/ui';
import { parseDateString } from '~/utils/parseDateString';
import './PerformanceForm.scss';

export type PerformanceFormProps = {
  exercise?: Exercise;
  instance?: Performance;
  onSubmit: (data: PerformanceFormData, metrics: PerformanceMetricData[], instance?: Performance) => void;
};

export type PerformanceFormData = {
  exercise: string;
  date: string;
};

export type PerformanceMetricData = {
  metric: string;
  value: number;
};

export const PerformanceForm = ({ exercise, instance, onSubmit }: PerformanceFormProps) => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = React.useState<PerformanceMetricData[]>([]);

  const performanceForm = useForm<PerformanceFormData>({
    defaultValues: {
      date: instance
        ? format(parseDateString(instance.date, 'yyyy-MM-dd'), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
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

  React.useEffect(() => {
    if (!instance && selectedExercise) {
      setPerformanceMetrics(
        selectedExercise.metrics.map((metric) => ({
          metric: metric.id,
          value: 0,
        })),
      );
    } else if (instance) {
      setPerformanceMetrics(
        instance.metrics.map((metric) => ({
          metric: metric.metric.id,
          value: metric.value,
        })),
      );
    }
  }, [instance, selectedExercise]);

  function metricsValid() {
    return selectedExercise?.metrics.every((metric) => {
      const value = performanceMetrics.find((pm) => pm.metric === metric.id)?.value;
      return value !== undefined && value >= 0;
    });
  }

  return (
    <form
      className="PerformanceForm"
      onSubmit={performanceForm.handleSubmit((data) => onSubmit(data, performanceMetrics, instance))}
    >
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
      {selectedExercise && (
        <>
          {selectedExercise.metrics.map((metric) => (
            <Input
              key={metric.id}
              fluid
              id={metric.id}
              label={metric.name}
              min="0"
              type="number"
              value={performanceMetrics.find((m) => m.metric === metric.id)?.value || 0}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setPerformanceMetrics((metrics) => {
                  const index = metrics.findIndex((m) => m.metric === metric.id);
                  if (index === -1) {
                    return [...metrics, { metric: metric.id, value }];
                  }
                  return metrics.map((m, idx) => (idx === index ? { metric: metric.id, value } : m));
                });
              }}
            />
          ))}
        </>
      )}
      <Button
        color="primary"
        disabled={!performanceForm.formState.isValid || !metricsValid()}
        fluid
        type="submit"
        variant="raised"
      >
        Save
      </Button>
    </form>
  );
};
