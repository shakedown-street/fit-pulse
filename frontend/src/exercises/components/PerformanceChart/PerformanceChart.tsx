import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Performance } from '~/types';
import { formatDateString } from '~/utils/dateString';
import './PerformanceChart.scss';

export type PerformanceChartProps = {
  performances: Performance[];
};

export const PerformanceChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="PerformanceChartTooltip">
        <p className="PerformanceChartTooltip__label">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="PerformanceChartTooltip__value">
            {`${p.name}: ${p.value}`}
          </p>
        ))}
      </div>
    );
  }
};

export const PerformanceChart = ({ performances }: PerformanceChartProps) => {
  const data = performances
    .slice()
    .sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      return a.created_at.localeCompare(b.created_at);
    })
    .map((p) => {
      const metrics = p.metrics.reduce(
        (acc, pm) => {
          acc[pm.metric.name] = pm.value;
          return acc;
        },
        {} as { [key: string]: number },
      );
      return {
        date: formatDateString(p.date, 'yyyy-MM-dd', 'MM/dd/yy'),
        ...metrics,
      };
    });

  const metricNames = Array.from(new Set(performances.flatMap((p) => p.metrics.map((pm) => pm.metric.name))));

  const metricColors = [
    '#5f3dc4', // violet 9
    '#364fc7', // indigo 9
    '#1862ab', // blue 9
    '#0b7285', // cyan 9
    '#087f5b', // teal 9
    '#2b8a3e', // green 9
    '#5c940d', // lime 9
    '#e67700', // yellow 9
    '#d9480f', // orange 9
  ];

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
          {metricNames.map((name, idx) => (
            <linearGradient key={idx} id={`color${name.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={metricColors[idx]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={metricColors[idx]} stopOpacity={0.2} />
            </linearGradient>
          ))}
        </defs>
        {metricNames.map((name, idx) => (
          <Area
            key={name}
            dataKey={name}
            stroke={metricColors[idx]}
            fillOpacity={1}
            fill={`url(#color${name.replace(/\s+/g, '')})`}
            type="monotone"
          />
        ))}
        <CartesianGrid stroke="#212529" strokeDasharray="3 3" />
        <XAxis dataKey="date" hide />
        <YAxis hide />
        <Tooltip content={<PerformanceChartTooltip />} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
