import { useState, useEffect, Suspense, lazy } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Stars = lazy(() => import('../three/Stars'));
const CosmicEffects = lazy(() => import('../three/CosmicEffects'));

const pageVariants = {
  initial: { opacity: 0, scale: 0.96, filter: 'blur(8px)', y: 20 },
  animate: { 
    opacity: 1, scale: 1, filter: 'blur(0px)', y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, scale: 1.02, filter: 'blur(4px)', y: -15,
    transition: { duration: 0.3, ease: [0.55, 0.085, 0.68, 0.53] }
  },
};

function BackgroundEffects() {
  const { device, isLowPower } = useDeviceDetect();

  // Dispositivo fraco ou mobile = apenas estrelas CSS
  if (isLowPower || device === 'mobile') {
    return <SimpleStars />;
  }

  // Tablet = apenas Stars (Júpiter + estrelas)
  if (device === 'tablet') {
    return (
      <Suspense fallback={<SimpleStars />}>
        <Stars />
      </Suspense>
    );
  }

  // Desktop = Stars + CosmicEffects JUNTOS em um único Canvas
  return (
    <Suspense fallback={<SimpleStars />}>
      <Stars />
      <CosmicEffects />
    </Suspense>
  );
}

function SimpleStars() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" style={{ background: '#0A0A0F' }}>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#B44CFF' : i % 3 === 1 ? '#FF3D8E' : '#D4A5FF',
            opacity: Math.random() * 0.6 + 0.2,
            animation: `pulseLilac ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function SmartLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { device } = useDeviceDetect();

  useEffect(() => {
    if (device === 'mobile') {
      setSidebarOpen(false);
    }
  }, [device]);

  return (
    <div className="h-screen flex overflow-hidden bg-abyss">
      <BackgroundEffects />
      
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: device === 'mobile' ? -320 : -280 }}
            animate={{ x: 0 }}
            exit={{ x: device === 'mobile' ? -320 : -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`${device === 'mobile' ? 'w-80 absolute z-40 h-full' : 'w-72'} flex-shrink-0`}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {device === 'mobile' && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        
        <main className={`flex-1 overflow-y-auto ${device === 'mobile' ? 'p-3' : 'p-6'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={device === 'mobile' ? {} : pageVariants}
              initial={device === 'mobile' ? {} : "initial"}
              animate={device === 'mobile' ? {} : "animate"}
              exit={device === 'mobile' ? {} : "exit"}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
