import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, FileText } from 'lucide-react';
import api from '../../lib/api';

interface Props {
  isOpen: boolean;
  onClose: (refresh?: boolean) => void;
}

export default function NewClientModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.phone) {
      setMessage('❌ Nome e telefone são obrigatórios!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await api.post('/clients', {
        name: form.name,
        email: form.email || null,
        phone: form.phone,
        notes: form.notes || null,
      });
      
      setMessage('✅ Cliente cadastrado com sucesso!');
      setTimeout(() => {
        onClose(true); // true = recarregar lista
        setMessage('');
        setForm({ name: '', email: '', phone: '', notes: '' });
      }, 1000);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Erro ao cadastrar cliente';
      setMessage('❌ ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => onClose(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-strong p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User size={22} className="text-purple-neon" />
                Novo Cliente
              </h2>
              <button onClick={() => onClose(false)} className="text-lilac-light/50 hover:text-white">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-lilac-light/60 mb-1">Nome *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-lilac-light/30 w-4 h-4" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nome completo"
                    className="input-premium w-full pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-lilac-light/60 mb-1">Telefone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-lilac-light/30 w-4 h-4" />
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="input-premium w-full pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-lilac-light/60 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-lilac-light/30 w-4 h-4" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="input-premium w-full pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-lilac-light/60 mb-1">Observações</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-lilac-light/30 w-4 h-4" />
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Observações (opcional)"
                    className="input-premium w-full h-20 resize-none pl-10"
                  />
                </div>
              </div>

              {message && (
                <p className={`text-sm ${message.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-premium w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <User size={18} />
                {loading ? 'Cadastrando...' : 'Cadastrar Cliente'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
