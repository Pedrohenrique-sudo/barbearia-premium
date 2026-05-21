import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Scissors, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

// COMETA ULTRA REALISTA
function RealisticComet({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let startTime = Date.now();
    const duration = 2000;
    let particles: any[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Criar partículas da cauda
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 0.3 + Math.random() * 1.5,
        size: 1 + Math.random() * 4,
        color: Math.random() < 0.5 ? 
          `hsl(${270 + Math.random() * 30}, 100%, ${60 + Math.random() * 40}%)` :
          `hsl(${340 + Math.random() * 20}, 100%, ${50 + Math.random() * 50}%)`,
      });
    }
    
    // Faíscas da explosão
    let explosionParticles: any[] = [];
    let exploded = false;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Posição do cometa (curva de bezier)
      const t = progress;
      const startX = -100;
      const startY = -100;
      const cp1x = canvas.width * 0.3;
      const cp1y = canvas.height * 0.1;
      const cp2x = canvas.width * 0.6;
      const cp2y = canvas.height * 0.6;
      const endX = centerX;
      const endY = centerY;
      
      const cx = Math.pow(1-t, 3) * startX + 3 * Math.pow(1-t, 2) * t * cp1x + 3 * (1-t) * Math.pow(t, 2) * cp2x + Math.pow(t, 3) * endX;
      const cy = Math.pow(1-t, 3) * startY + 3 * Math.pow(1-t, 2) * t * cp1y + 3 * (1-t) * Math.pow(t, 2) * cp2y + Math.pow(t, 3) * endY;
      
      if (progress < 0.85) {
        // Núcleo do cometa
        const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
        coreGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
        coreGlow.addColorStop(0.1, 'rgba(220, 180, 255, 0.9)');
        coreGlow.addColorStop(0.3, 'rgba(180, 76, 255, 0.6)');
        coreGlow.addColorStop(0.6, 'rgba(120, 40, 220, 0.2)');
        coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, 35, 0, Math.PI * 2);
        ctx.fill();
        
        // Brilho interno intenso
        const innerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10);
        innerGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
        innerGlow.addColorStop(0.5, 'rgba(200, 150, 255, 0.8)');
        innerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Cauda
        const angle = Math.atan2(cy - startY, cx - startX) + Math.PI;
        const tailLength = 200 + Math.random() * 30;
        
        // Cauda externa (difusa)
        for (let i = 0; i < 5; i++) {
          const offsetY = (i - 2) * 8;
          ctx.beginPath();
          ctx.moveTo(cx, cy + offsetY);
          const tx = cx + Math.cos(angle) * tailLength;
          const ty = cy + Math.sin(angle) * tailLength + offsetY;
          ctx.lineTo(tx, ty);
          
          const gradient = ctx.createLinearGradient(cx, cy, tx, ty);
          gradient.addColorStop(0, 'rgba(180, 76, 255, 0.8)');
          gradient.addColorStop(0.3, 'rgba(140, 50, 220, 0.4)');
          gradient.addColorStop(0.7, 'rgba(100, 30, 180, 0.1)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 8 - i * 1.5;
          ctx.stroke();
        }
        
        // Cauda central brilhante
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const tcx = cx + Math.cos(angle) * tailLength * 0.7;
        const tcy = cy + Math.sin(angle) * tailLength * 0.7;
        ctx.lineTo(tcx, tcy);
        const tailGrad = ctx.createLinearGradient(cx, cy, tcx, tcy);
        tailGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        tailGrad.addColorStop(0.5, 'rgba(200, 150, 255, 0.5)');
        tailGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Partículas da cauda
        particles.forEach((p: any) => {
          p.life += 0.016;
          if (p.life < p.maxLife) {
            const px = cx + Math.cos(angle) * (50 + p.life * 150);
            const py = cy + Math.sin(angle) * (50 + p.life * 150) + (Math.random() - 0.5) * 30;
            ctx.fillStyle = p.color.replace('1)', `${1 - p.life / p.maxLife})`);
            ctx.beginPath();
            ctx.arc(px, py, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        // Raios de luz saindo do núcleo
        for (let i = 0; i < 8; i++) {
          const rayAngle = (i / 8) * Math.PI * 2 + progress * 5;
          const rayLength = 15 + Math.random() * 20;
          const rx = cx + Math.cos(rayAngle) * rayLength;
          const ry = cy + Math.sin(rayAngle) * rayLength;
          
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(rx, ry);
          ctx.strokeStyle = 'rgba(200, 150, 255, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
      
      // Explosão no impacto
      if (progress >= 0.85 && !exploded) {
        exploded = true;
        for (let i = 0; i < 100; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 8;
          explosionParticles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: 0.5 + Math.random() * 1.5,
            size: 1 + Math.random() * 5,
            color: Math.random() < 0.33 ? '#B44CFF' : Math.random() < 0.66 ? '#FF3D8E' : '#FFFFFF',
          });
        }
      }
      
      // Renderizar explosão
      explosionParticles.forEach((p: any, i: number) => {
        p.life += 0.016;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        if (p.life < p.maxLife) {
          const alpha = 1 - p.life / p.maxLife;
          ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
          if (p.color.startsWith('#')) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });
      
      // Ondas de choque
      if (exploded) {
        const shockwaveTime = (elapsed - duration * 0.85) / 1000;
        for (let i = 0; i < 3; i++) {
          const radius = shockwaveTime * (200 + i * 80);
          const alpha = Math.max(0, 1 - shockwaveTime * 2 - i * 0.2);
          if (alpha > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${i === 0 ? '180,76,255' : i === 1 ? '255,61,142' : '212,165,255'}, ${alpha * 0.6})`;
            ctx.lineWidth = 3 - i;
            ctx.stroke();
          }
        }
      }
      
      if (progress < 1 || explosionParticles.some((p: any) => p.life < p.maxLife)) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [active]);

  if (!active) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
}

export default function Login() {
  const [email, setEmail] = useState('admin@barbeariapremium.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cometActive, setCometActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setCometActive(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;
      login(user, accessToken, refreshToken);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Credenciais inválidas');
      setLoading(false);
      setTimeout(() => setCometActive(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#06040A] flex items-center justify-center relative overflow-hidden">
      <RealisticComet active={cometActive} />

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0020] via-[#06040A] to-[#0D0015]" />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] transition-transform duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(180,76,255,0.1) 0%, transparent 70%)',
            transform: `translate(${mousePos.x - 250}px, ${mousePos.y - 250}px)`,
          }} />
        
        {/* Grid sutil */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(rgba(180,76,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(180,76,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* Partículas flutuantes */}
        {[...Array(25)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{
              width: 2 + Math.random() * 3, height: 2 + Math.random() * 3,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? '#B44CFF' : i % 3 === 1 ? '#FF3D8E' : '#D4A5FF',
            }}
            animate={{ y: [0, -20, 0], opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] mx-4 relative z-10"
      >
        <div className="relative bg-[#0A0A12]/80 backdrop-blur-2xl border border-white/[0.04] rounded-[24px] p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div className="relative mb-5" animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}>
              <div className="w-20 h-20 rounded-full border border-purple-neon/10 flex items-center justify-center">
                <motion.div className="w-16 h-16 rounded-full border border-pink-neon/20 flex items-center justify-center" animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
                  <motion.div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-neon via-pink-neon to-purple-neon flex items-center justify-center" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ boxShadow: '0 0 30px rgba(180,76,255,0.5), 0 0 60px rgba(255,61,142,0.25)' }}>
                    <Scissors className="w-6 h-6 text-white" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-neon via-pink-neon to-purple-neon">Barbearia</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-neon to-purple-neon">Premium</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-px bg-purple-neon/30" />
              <Sparkles size={8} className="text-purple-neon/40" />
              <p className="text-[9px] text-lilac-light/25 tracking-[0.3em] uppercase">Sistema Exclusivo</p>
              <Sparkles size={8} className="text-purple-neon/40" />
              <div className="w-3 h-px bg-purple-neon/30" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative group/input">
              <div className="relative flex items-center bg-[#0D0D18] rounded-xl border border-white/[0.03]">
                <Mail size={15} className="ml-4 text-lilac-light/25" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-lilac-light/15 focus:outline-none" placeholder="Email" required />
              </div>
            </div>

            <div className="relative group/input">
              <div className="relative flex items-center bg-[#0D0D18] rounded-xl border border-white/[0.03]">
                <Lock size={15} className="ml-4 text-lilac-light/25" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-lilac-light/15 focus:outline-none" placeholder="Senha" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-lilac-light/15 hover:text-purple-neon transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400/70 text-xs text-center bg-red-500/5 rounded-lg py-2">
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="relative w-full py-3.5 rounded-xl font-semibold text-sm text-white overflow-hidden disabled:opacity-50 mt-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-neon via-pink-neon to-purple-neon bg-[length:200%_100%] animate-shimmer" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <Sparkles size={15} />
                )}
                {loading ? 'ENTRANDO...' : 'ACESSAR SISTEMA'}
              </span>
            </motion.button>
          </form>

          <p className="text-center text-[9px] text-lilac-light/12 tracking-widest mt-6">BARBEARIA PREMIUM • 2026</p>
        </div>
      </motion.div>
    </div>
  );
}
