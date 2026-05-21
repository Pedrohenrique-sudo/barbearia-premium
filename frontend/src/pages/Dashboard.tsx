import { motion } from 'framer-motion';
import { Calendar, DollarSign, Users, TrendingUp, Star, Clock } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import AppointmentsChart from '../components/dashboard/AppointmentsChart';
import RecentAppointments from '../components/dashboard/RecentAppointments';
import TopBarbers from '../components/dashboard/TopBarbers';

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-lilac-light/50 mt-1">Visão geral da sua barbearia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Agendamentos Hoje"
          value="8"
          icon={Calendar}
          trend="+12%"
          trendUp={true}
          delay={0}
        />
        <MetricCard
          title="Faturamento (Mês)"
          value="R$ 1.250"
          icon={DollarSign}
          trend="+8.5%"
          trendUp={true}
          delay={0.1}
        />
        <MetricCard
          title="Clientes Ativos"
          value="156"
          icon={Users}
          trend="+5%"
          trendUp={true}
          delay={0.2}
        />
        <MetricCard
          title="Ticket Médio"
          value="R$ 45"
          icon={TrendingUp}
          trend="-2%"
          trendUp={false}
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-neon" />
            Faturamento Semanal
          </h2>
          <RevenueChart />
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Star size={20} className="text-pink-neon" />
            Top Barbeiros
          </h2>
          <TopBarbers />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock size={20} className="text-purple-neon" />
            Agendamentos Recentes
          </h2>
          <RecentAppointments />
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-pink-neon" />
            Distribuição de Agendamentos
          </h2>
          <AppointmentsChart />
        </div>
      </div>
    </motion.div>
  );
}
