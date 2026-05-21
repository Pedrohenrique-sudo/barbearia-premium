import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Concluídos', value: 45, color: '#B44CFF' },
  { name: 'Agendados', value: 30, color: '#FF3D8E' },
  { name: 'Cancelados', value: 10, color: '#C38BFF' },
  { name: 'Não Compareceram', value: 5, color: '#7B2FFF' },
];

export default function AppointmentsChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#12121A',
            border: '1px solid rgba(180, 76, 255, 0.2)',
            borderRadius: '12px',
            color: '#FFFFFF',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
