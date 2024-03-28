import React from 'react';
import { useForm } from 'react-hook-form';
import { ListResponse, http } from '~/http';
import { Exercise, Metric } from '~/types';
import { Button, Input, Select } from '~/ui';
import './ExerciseForm.scss';

export type ExerciseFormProps = {
  instance?: Exercise;
  onSubmit: (data: ExerciseFormData, instance?: Exercise) => void;
};

export type ExerciseFormData = {
  name: string;
  metrics: string[];
};

export const ExerciseForm = ({ instance, onSubmit }: ExerciseFormProps) => {
  const [metrics, setMetrics] = React.useState<Metric[]>([]);
  const [loading, setLoading] = React.useState(false);
  const exerciseForm = useForm<ExerciseFormData>({
    defaultValues: {
      name: instance ? instance.name : '',
      metrics: instance ? instance.metrics.map((metric) => metric.id) : [],
    },
  });

  React.useEffect(() => {
    setLoading(true);
    http
      .get<ListResponse<Metric>>('/api/metrics/')
      .then((metrics) => {
        setMetrics(metrics.data.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form className="ExerciseForm" onSubmit={exerciseForm.handleSubmit((data) => onSubmit(data, instance))}>
      <Input fluid id="name" label="Name" {...exerciseForm.register('name', { required: true })} />
      <Select
        disabled={!!instance}
        fluid
        hint={
          <>
            Metrics cannot be changed after creation.
            <br />
            Hold down "Control" to select more than one.
          </>
        }
        id="metrics"
        label="Metrics"
        multiple
        {...exerciseForm.register('metrics', { required: true })}
      >
        {metrics.map((metric) => (
          <option key={metric.id} value={metric.id}>
            {metric.name}
          </option>
        ))}
      </Select>
      <Button color="primary" disabled={!exerciseForm.formState.isValid} fluid type="submit" variant="raised">
        Save
      </Button>
    </form>
  );
};
