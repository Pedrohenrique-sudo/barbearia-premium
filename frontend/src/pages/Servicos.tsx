import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Plus, Clock, DollarSign, Trash2, X } from 'lucide-react';
import api from '../lib/api';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  active: boolean;
}

export default function Servicos() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', price: '', duration: '30' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${name}"?`)) return;
    try {
      await api.delete(`/services/${id}`);
      setMessage('✅ Serviço removido!');
      loadServices();
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('❌ Erro ao remover serviço');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.price) {
      setMessage('❌ Nome e preço são obrigatórios!');
      return;
    }

    try {
      await api.post('/services', {
        name: newService.name,
        description: newService.description || null,
        price: Number(newService.price),
        duration: Number(newService.duration),
      });
      setMessage('✅ Serviço criado!');
      setModalOpen(false);
      setNewService({ name: '', description: '', price: '', duration: '30' });
      loadServices();
      setTimeout(() => setMessage(''), 2000);
    } catch (error: any) {
      setMessage('❌ ' + (error.response?.data?.error || 'Erro ao criar serviço'));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Serviços</h1>
          <p className="text-lilac-light/50 mt-1">Catálogo de serviços oferecidos</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setModalOpen(true)}
          className="btn-premium flex items-center gap-2"
        >
          <Plus size={20} /> Novo Serviço
        </motion.button>
      </div>

      {/* Mensagem */}
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm text-center py-2 rounded-lg ${message.includes('✅') ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}
        >
          {message}
        </motion.p>
      )}

      {/* Lista de Serviços */}
      {loading ? (
        <div className="text-center text-lilac-light/40 py-10">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.filter(s => s.active !== false).map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-neon/10">
                  <Scissors size={24} className="text-purple-neon" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(service.id, service.name)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{service.name}</h3>
              {service.description && (
                <p className="text-lilac-light/40 text-sm mb-4">{service.description}</p>
              )}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-purple-neon">
                  <DollarSign size={18} />
                  <span className="font-bold text-lg">R$ {Number(service.price).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-lilac-light/50">
                  <Clock size={16} />
                  <span className="text-sm">{service.duration}min</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Novo Serviço */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Scissors size={22} className="text-purple-neon" /> Novo Serviço
                </h2>
                <button onClick={() => setModalOpen(false)} className="text-lilac-light/50 hover:text-white">
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-lilac-light/60 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    placeholder="Nome do serviço"
                    className="input-premium w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-lilac-light/60 mb-1">Descrição</label>
                  <textarea
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="Descrição (opcional)"
                    className="input-premium w-full h-20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-lilac-light/60 mb-1">Preço (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      placeholder="45.00"
                      className="input-premium w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-lilac-light/60 mb-1">Duração (min)</label>
                    <input
                      type="number"
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                      placeholder="30"
                      className="input-premium w-full"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-premium w-full flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Criar Serviço
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
