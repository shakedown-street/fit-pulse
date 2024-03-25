import { useForm } from 'react-hook-form';
import { Diet } from '~/types';
import { Button, Input } from '~/ui';
import './DietForm.scss';

export type DietFormProps = {
  instance: Diet;
  onSubmit: (data: DietFormData) => void;
};

export type DietFormData = {
  name: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
};

export const DietForm = ({ instance, onSubmit }: DietFormProps) => {
  const dietForm = useForm<DietFormData>({
    defaultValues: {
      calories: instance ? instance.calories : 0,
      carbs: instance ? instance.carbs : 0,
      proteins: instance ? instance.proteins : 0,
      fats: instance ? instance.fats : 0,
    },
  });

  return (
    <form className="DietForm" onSubmit={dietForm.handleSubmit((data) => onSubmit(data))}>
      <Input
        fluid
        id="calories"
        label="Calories"
        type="number"
        {...dietForm.register('calories', { required: true })}
      />
      <Input fluid id="carbs" label="Carbs" type="number" {...dietForm.register('carbs', { required: true })} />
      <Input
        fluid
        id="proteins"
        label="Proteins"
        type="number"
        {...dietForm.register('proteins', { required: true })}
      />
      <Input fluid id="fats" label="Fats" type="number" {...dietForm.register('fats', { required: true })} />
      <Button color="primary" disabled={!dietForm.formState.isValid} fluid type="submit" variant="raised">
        Save
      </Button>
    </form>
  );
};
