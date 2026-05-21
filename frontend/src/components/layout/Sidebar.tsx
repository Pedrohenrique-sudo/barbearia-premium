import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Scissors, BarChart3, Settings, X, Sparkles } from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar, label: 'Agenda', path: '/agenda' },
  { icon: Users, label: 'Clientes', path: '/clientes' },
  { icon: Scissors, label: 'Serviços', path: '/servicos' },
  { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-full glass-strong m-2 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-neon to-pink-neon flex items-center justify-center animate-glow-purple">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-gradient font-bold text-lg leading-tight">Barbearia</h1>
            <p className="text-lilac-light/40 text-xs tracking-widest uppercase">Premium</p>
          </div>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-abyss-100 text-lilac-light/50 hover:text-lilac-light transition-colors"
        >
          <X size={18} />
        </motion.button>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-purple-neon/20 to-transparent border border-purple-neon/30 text-purple-neon'
                  : 'text-lilac-light/60 hover:text-lilac-light hover:bg-abyss-100/50'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-purple-neon' : 'group-hover:text-lilac-light transition-colors'} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-neon"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="pt-4 border-t border-purple-neon/10"
      >
        <button
          onClick={() => navigate('/configuracoes')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-lilac-light/40 hover:text-lilac-light hover:bg-abyss-100/50 transition-all"
        >
          <Settings size={20} />
          <span className="font-medium text-sm">Configurações</span>
        </button>
      </motion.div>
    </div>
  );
}
