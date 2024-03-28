import { format } from 'date-fns';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { http } from '~/http';
import { Food, FoodLog } from '~/types';
import { Button, Input, SearchDropdown } from '~/ui';
import './FoodLogForm.scss';

export type FoodLogFormProps = {
  readOnlyDate?: string;
  instance?: FoodLog;
  onSubmit: (data: FoodLogFormData, instance?: FoodLog) => void;
};

export type FoodLogFormData = {
  food: Food;
  date: string;
  servings: number;
};

export const FoodLogForm = ({ readOnlyDate, instance, onSubmit }: FoodLogFormProps) => {
  const foodLogForm = useForm<FoodLogFormData>({
    defaultValues: {
      date: instance ? instance.date : readOnlyDate ? readOnlyDate : format(new Date(), 'yyyy-MM-dd'),
      servings: instance ? instance.servings : 1,
    },
  });

  React.useEffect(() => {
    if (instance) {
      http.get(`/api/foods/${instance.food.id}`).then((food) => {
        foodLogForm.setValue('food', food.data);
      });
    }
  }, [instance]);

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
      <Controller
        control={foodLogForm.control}
        name="food"
        render={({ field }) => (
          <SearchDropdown
            endpoint="/api/foods/"
            onChange={(e) => {
              field.onChange(e);
            }}
            paramater="search"
            renderMatch={(match) => <>{match.name}</>}
            trigger={<Input fluid label="Food" readOnly type="input" value={field.value?.name} />}
          />
        )}
      />
      <Input
        fluid
        id="servings"
        label="Servings"
        step="0.01"
        type="number"
        {...foodLogForm.register('servings', { required: true })}
      />
      <Button color="primary" disabled={!foodLogForm.formState.isValid} fluid type="submit" variant="raised">
        Save
      </Button>
    </form>
  );
};
