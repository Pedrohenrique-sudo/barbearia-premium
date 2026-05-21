import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Download,
  Filter,
  Target,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 4500, expenses: 2200, profit: 2300 },
  { month: 'Fev', revenue: 5200, expenses: 2400, profit: 2800 },
  { month: 'Mar', revenue: 6100, expenses: 2600, profit: 3500 },
  { month: 'Abr', revenue: 5800, expenses: 2500, profit: 3300 },
  { month: 'Mai', revenue: 7200, expenses: 2800, profit: 4400 },
  { month: 'Jun', revenue: 8100, expenses: 3000, profit: 5100 },
];

const serviceDistribution = [
  { name: 'Corte Clássico', value: 35, color: '#B44CFF' },
  { name: 'Corte Premium', value: 25, color: '#FF3D8E' },
  { name: 'Barba Completa', value: 20, color: '#C38BFF' },
  { name: 'Corte + Barba', value: 15, color: '#7B2FFF' },
  { name: 'Hidratação', value: 5, color: '#FF69B4' },
];

const clientRetention = [
  { month: 'Jan', novos: 12, recorrentes: 45 },
  { month: 'Fev', novos: 15, recorrentes: 52 },
  { month: 'Mar', novos: 10, recorrentes: 58 },
  { month: 'Abr', novos: 18, recorrentes: 62 },
  { month: 'Mai', novos: 14, recorrentes: 68 },
  { month: 'Jun', novos: 20, recorrentes: 75 },
];

const topServices = [
  { name: 'Corte Clássico', quantity: 145, revenue: 'R$ 6.525', growth: '+12%' },
  { name: 'Corte Premium', quantity: 98, revenue: 'R$ 6.370', growth: '+18%' },
  { name: 'Barba Completa', quantity: 87, revenue: 'R$ 3.045', growth: '+8%' },
  { name: 'Corte + Barba', quantity: 65, revenue: 'R$ 4.550', growth: '+22%' },
  { name: 'Hidratação', quantity: 42, revenue: 'R$ 2.310', growth: '+5%' },
];

const KPICard = ({ title, value, change, icon: Icon }: any) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="glass-card p-5 cursor-pointer"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-lg bg-purple-neon/10">
        <Icon size={20} className="text-purple-neon" />
      </div>
      <div className="flex items-center gap-1 text-pink-neon text-sm">
        <ArrowUpRight size={14} />
        <span>{change}</span>
      </div>
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-lilac-light/40 text-sm">{title}</p>
  </motion.div>
);

export default function Relatorios() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Relatórios</h1>
          <p className="text-lilac-light/50 mt-1">Análise de desempenho da barbearia</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-glass flex items-center gap-2"
          >
            <Filter size={18} />
            Filtros
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-premium flex items-center gap-2"
          >
            <Download size={18} />
            Exportar
          </motion.button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Faturamento Total"
          value="R$ 36.900"
          change="+15.2%"
          icon={DollarSign}
        />
        <KPICard
          title="Ticket Médio"
          value="R$ 48,50"
          change="+8.3%"
          icon={TrendingUp}
        />
        <KPICard
          title="Total de Clientes"
          value="156"
          change="+12.5%"
          icon={Users}
        />
        <KPICard
          title="Agendamentos/Mês"
          value="437"
          change="+10.8%"
          icon={Calendar}
        />
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-purple-neon" />
            Faturamento vs Despesas
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B44CFF" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#B44CFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3D8E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FF3D8E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="month" stroke="#9B6BFF" tick={{ fill: '#9B6BFF' }} />
              <YAxis stroke="#9B6BFF" tick={{ fill: '#9B6BFF' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121A',
                  border: '1px solid rgba(180, 76, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#B44CFF" strokeWidth={2} fill="url(#revenueGrad2)" name="Receita" />
              <Area type="monotone" dataKey="profit" stroke="#FF3D8E" strokeWidth={2} fill="url(#profitGrad2)" name="Lucro" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target size={20} className="text-pink-neon" />
            Serviços Mais Vendidos
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {serviceDistribution.map((entry, index) => (
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
        </div>
      </div>

      {/* Client Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users size={20} className="text-purple-neon" />
            Retenção de Clientes
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={clientRetention}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="month" stroke="#9B6BFF" tick={{ fill: '#9B6BFF' }} />
              <YAxis stroke="#9B6BFF" tick={{ fill: '#9B6BFF' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121A',
                  border: '1px solid rgba(180, 76, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                }}
              />
              <Bar dataKey="novos" fill="#B44CFF" radius={[8, 8, 0, 0]} name="Novos" />
              <Bar dataKey="recorrentes" fill="#FF3D8E" radius={[8, 8, 0, 0]} name="Recorrentes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award size={20} className="text-pink-neon" />
            Top Serviços
          </h2>
          <div className="space-y-3">
            {topServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-abyss-100/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-neon/10 flex items-center justify-center text-purple-neon font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{service.name}</p>
                  <p className="text-lilac-light/40 text-xs">{service.quantity} agendamentos</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-neon font-semibold text-sm">{service.revenue}</p>
                  <p className="text-pink-neon text-xs">{service.growth}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
