import { Food } from './Food';

export type FoodLog = {
  id: string;
  created_at: string;
  updated_at: string;
  date: string;
  servings: number;
  user: string;
  food: Food;
};
