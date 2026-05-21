import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Stars from '../three/Stars';
import CosmicEffects from '../three/CosmicEffects';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// Variantes de transição ultra suaves
const pageTransition = {
  initial: { 
    opacity: 0, 
    scale: 0.94, 
    y: 30,
    filter: 'blur(12px)',
    rotateX: 5,
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    filter: 'blur(0px)',
    rotateX: 0,
    transition: { 
      duration: 0.7, 
      ease: [0.25, 0.1, 0.25, 1],
    }
  },
  exit: { 
    opacity: 0, 
    scale: 1.03, 
    y: -20,
    filter: 'blur(6px)',
    rotateX: -3,
    transition: { 
      duration: 0.4, 
      ease: [0.55, 0, 1, 0.45],
    }
  },
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="h-screen flex overflow-hidden bg-abyss">
      <Stars />
      <CosmicEffects />
      
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-72 flex-shrink-0"
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ transformOrigin: 'center center' }}
            >
              {/* Partículas mágicas na transição */}
              <motion.div
                className="fixed inset-0 pointer-events-none z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 4 + Math.random() * 8,
                      height: 4 + Math.random() * 8,
                      left: `${10 + Math.random() * 80}%`,
                      top: `${10 + Math.random() * 80}%`,
                      background: [
                        '#B44CFF', '#FF3D8E', '#D4A5FF', 
                        '#D4AF37', '#FF69B4', '#FFFFFF'
                      ][Math.floor(Math.random() * 6)],
                    }}
                    initial={{ 
                      scale: 0, 
                      opacity: 1,
                      x: 0,
                      y: 0,
                    }}
                    animate={{
                      scale: [0, 1.8, 0],
                      opacity: [1, 0.6, 0],
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200,
                    }}
                    transition={{ 
                      duration: 0.8 + Math.random() * 0.5, 
                      delay: Math.random() * 0.3,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </motion.div>

              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
