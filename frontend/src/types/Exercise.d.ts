import { Metric } from './Metric';

export type Exercise = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  user: string;
  metrics: Metric[];
};
