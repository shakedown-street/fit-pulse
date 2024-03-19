import { useForm } from 'react-hook-form';
import { Button, Input } from '~/ui';
import { Exercise } from './Exercise';
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
          disabled={!!instance}
          id="value_type"
          {...exerciseForm.register('value_type', { required: true })}
        >
          <option value="weight">Weight</option>
          <option value="reps">Reps</option>
          <option value="time">Time</option>
          <option value="bpm">BPM</option>
        </select>
      </div>
      {instance && <p className="hint">Exercise type cannot be changed once it has been created.</p>}
      <Button color="primary" disabled={!exerciseForm.formState.isValid} fluid type="submit" variant="raised">
        {instance ? 'Update' : 'Create'}
      </Button>
    </form>
  );
};
