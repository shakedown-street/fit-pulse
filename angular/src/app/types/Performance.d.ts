import { Exercise } from './Exercise';
import { PerformanceMetric } from './PerformanceMetric';

export type Performance = {
  id: string;
  created_at: string;
  updated_at: string;
  user: string;
  date: string;
  exercise: Exercise;
  metrics: PerformanceMetric[];
};
