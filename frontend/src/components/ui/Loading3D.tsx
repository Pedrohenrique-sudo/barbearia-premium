import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

export default function Loading3D() {
  return (
    <div className="fixed inset-0 bg-obsidian flex items-center justify-center z-50">
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-neon to-pink-neon flex items-center justify-center animate-glow-purple">
            <Scissors className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <motion.p
          className="text-gradient text-lg font-semibold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Barbearia Premium
        </motion.p>
      </motion.div>
    </div>
  );
}
