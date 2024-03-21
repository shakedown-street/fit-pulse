import { useForm } from 'react-hook-form';
import { Exercise } from '~/types';
import { Button, Input } from '~/ui';
import './ExerciseForm.scss';

export type ExerciseFormProps = {
  instance?: Exercise;
  onSubmit: (data: ExerciseFormData, instance?: Exercise) => void;
};

export type ExerciseFormData = {
  name: string;
  value_type: 'weight' | 'reps' | 'time' | 'bpm';
};

export const ExerciseForm = ({ instance, onSubmit }: ExerciseFormProps) => {
  const exerciseForm = useForm<ExerciseFormData>({
    defaultValues: {
      name: instance ? instance.name : '',
      value_type: instance ? instance.value_type : 'weight',
    },
  });

  return (
    <form className="ExerciseForm" onSubmit={exerciseForm.handleSubmit((data) => onSubmit(data, instance))}>
      <Input fluid id="name" label="Name" {...exerciseForm.register('name', { required: true })} />
      <div className="Input__container Input__container--fluid">
        <label className="Input__label" htmlFor="value_type">
          Type
        </label>
        <select
          className="Input Input--fluid"
          disabled={instance && instance.performance_count > 0}
          id="value_type"
          {...exerciseForm.register('value_type', { required: true })}
        >
          <option value="weight">Weight</option>
          <option value="reps">Reps</option>
          <option value="time">Time</option>
          <option value="bpm">BPM</option>
        </select>
        <p className="hint mt-2">Type cannot be changed after performances have been created.</p>
      </div>
      <Button color="primary" disabled={!exerciseForm.formState.isValid} fluid type="submit" variant="raised">
        {instance ? 'Update' : 'Create'}
      </Button>
    </form>
  );
};
