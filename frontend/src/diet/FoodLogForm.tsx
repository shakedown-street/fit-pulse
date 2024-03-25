import React from 'react';
import { useForm } from 'react-hook-form';
import { ListResponse, http } from '~/http';
import { Food, FoodLog } from '~/types';
import { Button, Input, Select } from '~/ui';
import './FoodLogForm.scss';
import { format } from 'date-fns';
import { parseDateString } from '~/utils/parseDateString';

export type FoodLogFormProps = {
  readOnlyDate?: string;
  instance?: FoodLog;
  onSubmit: (data: FoodLogFormData, instance?: FoodLog) => void;
};

export type FoodLogFormData = {
  food: string;
  date: string;
  servings: number;
};

export const FoodLogForm = ({ readOnlyDate, instance, onSubmit }: FoodLogFormProps) => {
  const [foods, setFoods] = React.useState<Food[]>([]);

  const foodLogForm = useForm<FoodLogFormData>({
    defaultValues: {
      date: instance
        ? format(parseDateString(instance.date, 'yyyy-MM-dd'), 'yyyy-MM-dd')
        : readOnlyDate
          ? format(parseDateString(readOnlyDate, 'yyyy-MM-dd'), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
      servings: instance ? instance.servings : 1,
    },
  });

  React.useEffect(() => {
    http.get<ListResponse<Food>>('/api/foods/').then((foods) => {
      setFoods(foods.data.results);
    });
  }, []);

  React.useEffect(() => {
    if (instance) {
      foodLogForm.setValue('food', instance.food.id);
    }
  }, [foods]);

  return (
    <form className="FoodLogForm" onSubmit={foodLogForm.handleSubmit((data) => onSubmit(data, instance))}>
      <Input
        fluid
        id="date"
        label="Date"
        readOnly={!!readOnlyDate}
        type="date"
        {...foodLogForm.register('date', { required: true })}
      />
      <Select fluid id="food" label="Food" {...foodLogForm.register('food', { required: true })}>
        <option></option>
        {foods.map((food) => (
          <option key={food.id} value={food.id}>
            {food.name}
          </option>
        ))}
      </Select>
      <Input
        fluid
        id="servings"
        label="Servings"
        type="number"
        {...foodLogForm.register('servings', { required: true })}
      />
      <Button color="primary" disabled={!foodLogForm.formState.isValid} fluid type="submit" variant="raised">
        Save
      </Button>
    </form>
  );
};
