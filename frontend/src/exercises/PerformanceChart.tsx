import { format } from 'date-fns';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Performance } from '~/types';
import { parseDateString } from '~/utils/parseDateString';

export type PerformanceChartProps = {
  performances: Performance[];
};

export const PerformanceChart = ({ performances }: PerformanceChartProps) => {
  const data = performances
    .slice()
    .sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      return a.updated_at.localeCompare(b.updated_at);
    })
    .map((p) => {
      return {
        date: format(parseDateString(p.date, 'yyyy-MM-dd'), 'MM/dd'),
        value: p.value,
      };
    });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5f3dc4" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#5f3dc4" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <Area dataKey="value" stroke="#5f3dc4" fillOpacity={1} fill="url(#colorValue)" type="monotone" />
        <CartesianGrid stroke="#212529" strokeDasharray="3 3" />
        <XAxis dataKey="date" hide />
        <YAxis width={48} />
        <Tooltip />
      </AreaChart>
    </ResponsiveContainer>
  );
};
