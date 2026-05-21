import { motion } from 'framer-motion';
import { Clock, User, Scissors } from 'lucide-react';

const recentAppointments = [
  { client: 'João Mendes', service: 'Corte Clássico', time: '09:00', barber: 'Ricardo' },
  { client: 'Pedro Alves', service: 'Barba Completa', time: '10:00', barber: 'Carlos' },
  { client: 'Lucas Ferreira', service: 'Corte + Barba', time: '14:00', barber: 'Ricardo' },
];

export default function RecentAppointments() {
  return (
    <div className="space-y-3">
      {recentAppointments.map((appointment, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-abyss-100/50 transition-colors cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-neon/20 to-pink-neon/20 flex items-center justify-center group-hover:from-purple-neon/30 group-hover:to-pink-neon/30 transition-all">
            <User size={18} className="text-purple-neon" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{appointment.client}</p>
            <div className="flex items-center gap-2 text-lilac-light/40 text-xs">
              <Scissors size={10} />
              <span>{appointment.service}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-pink-neon text-sm">
              <Clock size={12} />
              <span>{appointment.time}</span>
            </div>
            <p className="text-lilac-light/30 text-xs">{appointment.barber}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
