import { useForm } from 'react-hook-form';
import { Food } from '~/types';
import { Button, Input } from '~/ui';
import './FoodForm.scss';

export type FoodFormProps = {
  instance?: Food;
  onSubmit: (data: FoodFormData, instance?: Food) => void;
};

export type FoodFormData = {
  name: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
};

export const FoodForm = ({ instance, onSubmit }: FoodFormProps) => {
  const foodForm = useForm<FoodFormData>({
    defaultValues: {
      name: instance ? instance.name : '',
      calories: instance ? instance.calories : undefined,
      carbs: instance ? instance.carbs : undefined,
      proteins: instance ? instance.proteins : undefined,
      fats: instance ? instance.fats : undefined,
    },
  });

  return (
    <form className="FoodForm" onSubmit={foodForm.handleSubmit((data) => onSubmit(data, instance))}>
      <Input fluid id="name" label="Name" {...foodForm.register('name', { required: true })} />
      <Input
        fluid
        id="calories"
        label="Calories"
        type="number"
        {...foodForm.register('calories', { required: true })}
      />
      <Input fluid id="carbs" label="Carbs" type="number" {...foodForm.register('carbs', { required: true })} />
      <Input
        fluid
        id="proteins"
        label="Proteins"
        type="number"
        {...foodForm.register('proteins', { required: true })}
      />
      <Input fluid id="fats" label="Fats" type="number" {...foodForm.register('fats', { required: true })} />
      <Button color="primary" disabled={!foodForm.formState.isValid} fluid type="submit" variant="raised">
        Save
      </Button>
    </form>
  );
};
