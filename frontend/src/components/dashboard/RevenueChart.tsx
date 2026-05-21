import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Seg', revenue: 450 },
  { name: 'Ter', revenue: 620 },
  { name: 'Qua', revenue: 580 },
  { name: 'Qui', revenue: 890 },
  { name: 'Sex', revenue: 1200 },
  { name: 'Sáb', revenue: 1450 },
  { name: 'Dom', revenue: 0 },
];

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#B44CFF" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#B44CFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
        <XAxis dataKey="name" stroke="#9B6BFF" tick={{ fill: '#9B6BFF', fontSize: 12 }} />
        <YAxis stroke="#9B6BFF" tick={{ fill: '#9B6BFF', fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#12121A',
            border: '1px solid rgba(180, 76, 255, 0.2)',
            borderRadius: '12px',
            color: '#FFFFFF',
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#B44CFF"
          strokeWidth={2}
          fill="url(#revenueGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
