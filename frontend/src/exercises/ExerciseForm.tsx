import { useForm } from 'react-hook-form';
import { Button, Input } from '~/ui';
import './ExerciseForm.scss';

export type ExerciseFormProps = {
  onSubmit: (data: ExerciseFormData) => void;
};

export type ExerciseFormData = {
  name: string;
  value_type: 'weight' | 'reps' | 'time' | 'bpm';
};

export const ExerciseForm = ({ onSubmit }: ExerciseFormProps) => {
  const exerciseForm = useForm<ExerciseFormData>();

  return (
    <form className="ExerciseForm" onSubmit={exerciseForm.handleSubmit(onSubmit)}>
      <Input fluid id="name" label="Name" {...exerciseForm.register('name', { required: true })} />
      <div className="Input__container Input__container--fluid">
        <label className="Input__label" htmlFor="value_type">
          Type
        </label>
        <select
          className="Input Input--fluid"
          id="value_type"
          {...exerciseForm.register('value_type', { required: true })}
        >
          <option value="weight">Weight</option>
          <option value="reps">Reps</option>
          <option value="time">Time</option>
          <option value="bpm">BPM</option>
        </select>
      </div>
      <Button color="primary" disabled={!exerciseForm.formState.isValid} fluid type="submit" variant="raised">
        Create
      </Button>
    </form>
  );
};
