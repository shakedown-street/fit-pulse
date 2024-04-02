import { format } from 'date-fns';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { http } from '~/http';
import { Food, FoodLog } from '~/types';
import { Button, Input, RadixDialog, SearchDropdown, Select } from '~/ui';
import { FoodForm, FoodFormData } from '../FoodForm/FoodForm';
import './FoodLogForm.scss';

export type FoodLogFormProps = {
  readOnlyDate?: string;
  instance?: FoodLog;
  onSubmit: (data: FoodLogFormData, instance?: FoodLog) => void;
};

export type FoodLogFormData = {
  food: Food;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | '';
  servings: number;
};

export const FoodLogForm = ({ readOnlyDate, instance, onSubmit }: FoodLogFormProps) => {
  const [createFoodDialogOpen, setCreateFoodDialogOpen] = React.useState(false);

  const foodLogForm = useForm<FoodLogFormData>({
    defaultValues: {
      date: instance ? instance.date : readOnlyDate ? readOnlyDate : format(new Date(), 'yyyy-MM-dd'),
      meal_type: instance ? instance.meal_type : '',
      servings: instance ? instance.servings : 1,
    },
  });

  const food = foodLogForm.watch('food');
  const servings = foodLogForm.watch('servings');

  React.useEffect(() => {
    if (instance) {
      http.get(`/api/foods/${instance.food.id}`).then((food) => {
        foodLogForm.setValue('food', food.data);
      });
    }
  }, [instance]);

  function submitFoodForm(data: FoodFormData) {
    http.post<Food>('/api/foods/', data).then((food) => {
      foodLogForm.setValue('food', food.data);
      setCreateFoodDialogOpen(false);
    });
  }

  return (
    <>
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
              renderEmpty={() => {
                return (
                  <>
                    <div className="flex flex-column align-center justify-center gap-4 mt-4">
                      <p>No foods match search query</p>
                      <Button color="primary" onClick={() => setCreateFoodDialogOpen(true)} variant="ghost">
                        Create Food
                      </Button>
                    </div>
                  </>
                );
              }}
              renderMatch={(match) => <>{match.name}</>}
              trigger={<Input fluid label="Food" readOnly type="input" value={field.value?.name} />}
            />
          )}
        />
        <Select fluid id="meal_type" label="Meal" {...foodLogForm.register('meal_type', { required: true })}>
          <option value=""></option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </Select>
        <Input
          fluid
          id="servings"
          label="Servings"
          step="0.01"
          type="number"
          {...foodLogForm.register('servings', { required: true })}
        />
        {food && servings && (
          <div className="FoodLogForm__totals">
            <p>
              <b>Calories:</b> {food.calories * servings}
            </p>
            <p>
              <b>Carbs:</b> {food.carbs * servings}g
            </p>
            <p>
              <b>Proteins:</b> {food.proteins * servings}g
            </p>
            <p>
              <b>Fats:</b> {food.fats * servings}g
            </p>
          </div>
        )}
        <Button color="primary" disabled={!foodLogForm.formState.isValid} fluid type="submit" variant="raised">
          Save
        </Button>
      </form>
      <RadixDialog className="p-6" open={createFoodDialogOpen} onOpenChange={setCreateFoodDialogOpen}>
        <h2 className="mb-2">Create Food</h2>
        <FoodForm onSubmit={submitFoodForm} />
      </RadixDialog>
    </>
  );
};
