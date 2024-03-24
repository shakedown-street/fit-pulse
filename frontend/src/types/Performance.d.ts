import { Exercise } from './Exercise';
import { Metric } from './Metric';

export type PerformanceMetric = {
  id: string;
  improvement_percent: number;
  created_at: string;
  updated_at: string;
  value: number;
  performance: string;
  metric: Metric;
};

export type Performance = {
  id: string;
  created_at: string;
  updated_at: string;
  user: string;
  date: string;
  exercise: Exercise;
  metrics: PerformanceMetric[];
  improvement_percent: number;
};
