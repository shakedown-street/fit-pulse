import { Cell, Pie, PieChart, Tooltip } from 'recharts';

export type MacroChartProps = {
  data: {
    name: string;
    consumed: number;
    target: number;
  };
};

export const MacroChart = ({ data }: MacroChartProps) => {
  return (
    <PieChart width={100} height={100} key={data.name}>
      <Pie
        dataKey="value"
        data={[
          { name: 'Consumed', value: data.consumed },
          { name: 'Remaining', value: Math.max(0, data.target - data.consumed) },
        ]}
        cx="50%"
        cy="50%"
        innerRadius={25}
        outerRadius={50}
      >
        <Cell fill="#5f3dc4" />
        <Cell fill="#212529" />
      </Pie>
      <Tooltip />
    </PieChart>
  );
};
