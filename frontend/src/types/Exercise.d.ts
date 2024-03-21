export type Exercise = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  value_type: 'weight' | 'reps' | 'time' | 'bpm';
  user: string;
  performance_count: number;
};
