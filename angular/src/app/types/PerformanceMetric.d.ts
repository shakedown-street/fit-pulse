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
