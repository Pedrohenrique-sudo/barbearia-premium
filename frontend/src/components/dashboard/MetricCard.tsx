import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: any;
  trend: string;
  trendUp: boolean;
  delay: number;
}

export default function MetricCard({ title, value, icon: Icon, trend, trendUp, delay }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay, 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ 
        y: -6, 
        scale: 1.03,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.97 }}
      className="glass-card p-5 cursor-pointer group relative overflow-hidden"
    >
      {/* Efeito de brilho no hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-neon/5 to-pink-neon/5"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <motion.div 
            className="p-2 rounded-lg bg-purple-neon/10 group-hover:bg-purple-neon/20 transition-colors"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Icon size={20} className="text-purple-neon" />
          </motion.div>
          <motion.div 
            className={`flex items-center gap-1 text-sm ${trendUp ? 'text-pink-neon' : 'text-red-400'}`}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span className="font-medium">{trend}</span>
          </motion.div>
        </div>
        <motion.h3 
          className="text-2xl font-bold text-white mb-1"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.15, type: 'spring', stiffness: 200 }}
        >
          {value}
        </motion.h3>
        <p className="text-lilac-light/40 text-sm">{title}</p>
      </div>
    </motion.div>
  );
}
