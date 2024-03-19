import { Exercise } from './Exercise';

export type Progress = {
  id: string;
  created_at: string;
  updated_at: string;
  exercise: Exercise;
  date: string;
  value: number;
  user: string;
};
