import { Menu, Search, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-strong m-4 p-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          className="text-lilac-light hover:text-purple-neon transition-colors"
        >
          <Menu size={24} />
        </motion.button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lilac-light/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar..."
            className="input-premium w-64 py-2 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/configuracoes')}
          className="p-2 rounded-xl hover:bg-abyss-100 transition-colors"
        >
          <Settings size={20} className="text-lilac-light" />
        </motion.button>

        <div className="h-8 w-px bg-purple-neon/20" />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-lilac-light/60 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-neon to-pink-neon flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} className="text-red-400" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
