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
  calories?: number;
  carbs?: number;
  proteins?: number;
  fats?: number;
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

  function handleSubmit(data: FoodFormData) {
    const filteredData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== '')) as FoodFormData;
    onSubmit(filteredData, instance);
  }

  return (
    <form className="FoodForm" onSubmit={foodForm.handleSubmit((data) => handleSubmit(data))}>
      <Input fluid id="name" label="Name" {...foodForm.register('name', { required: true })} />
      <Input fluid id="calories" label="Calories" type="number" {...foodForm.register('calories')} />
      <Input fluid id="carbs" label="Carbs" type="number" {...foodForm.register('carbs')} />
      <Input fluid id="proteins" label="Proteins" type="number" {...foodForm.register('proteins')} />
      <Input fluid id="fats" label="Fats" type="number" {...foodForm.register('fats')} />
      <Button color="primary" disabled={!foodForm.formState.isValid} fluid type="submit" variant="raised">
        Save
      </Button>
    </form>
  );
};
