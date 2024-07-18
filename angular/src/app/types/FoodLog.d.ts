import { Food } from './Food';

export type FoodLog = {
  id: string;
  created_at: string;
  updated_at: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | '';
  servings: number;
  user: string;
  food: Food;
};
