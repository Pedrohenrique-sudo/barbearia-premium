import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const topBarbers = [
  { name: 'Ricardo Silva', clients: 48, revenue: 'R$ 2.450' },
  { name: 'Carlos Oliveira', clients: 42, revenue: 'R$ 2.180' },
  { name: 'André Santos', clients: 35, revenue: 'R$ 1.890' },
];

export default function TopBarbers() {
  return (
    <div className="space-y-4">
      {topBarbers.map((barber, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-neon to-pink-neon flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {barber.name.charAt(0)}
              </span>
            </div>
            {index === 0 && (
              <Star className="absolute -top-1 -right-1 w-4 h-4 text-purple-neon fill-purple-neon" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{barber.name}</p>
            <p className="text-lilac-light/40 text-xs">{barber.clients} clientes</p>
          </div>
          <p className="text-purple-neon font-semibold text-sm">{barber.revenue}</p>
        </motion.div>
      ))}
    </div>
  );
}
