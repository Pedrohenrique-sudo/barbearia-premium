import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, Phone, Mail, ChevronRight, X, Trash2 } from 'lucide-react';
import NewClientModal from '../components/clients/NewClientModal';
import api from '../lib/api';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  visits: number;
  lastVisit: string;
  notes: string | null;
  status: string;
}

export default function Clientes() {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadClients = useCallback(async () => {
    try {
      const res = await api.get('/clients?limit=100');
      setClients(res.data.clients || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleModalClose = (refresh?: boolean) => {
    setModalOpen(false);
    if (refresh) loadClients();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${name}?`)) return;
    
    try {
      await api.delete(`/clients/${id}`);
      setSelectedClient(null);
      loadClients();
    } catch (error) {
      alert('Erro ao excluir cliente');
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search) ||
      (client.email && client.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="text-lilac-light/50 mt-1">Gerencie sua base de clientes</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setModalOpen(true)}
          className="btn-premium flex items-center gap-2"
        >
          <Plus size={20} /> Novo Cliente
        </motion.button>
      </div>

      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lilac-light/50 w-5 h-5" />
          <input type="text" placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-premium w-full pl-12" />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-lilac-light/40 py-10">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass-card divide-y divide-purple-neon/5">
              {filteredClients.length === 0 ? (
                <div className="p-8 text-center text-lilac-light/40">Nenhum cliente encontrado</div>
              ) : (
                filteredClients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 flex items-center gap-4 group"
                  >
                    <div onClick={() => setSelectedClient(client)} className="flex items-center gap-4 flex-1 cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-neon/20 to-pink-neon/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-neon font-bold">{client.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium">{client.name}</h3>
                        <div className="flex items-center gap-3 text-lilac-light/40 text-sm mt-1">
                          <span className="flex items-center gap-1"><Phone size={12} />{client.phone}</span>
                          {client.email && <span className="flex items-center gap-1"><Mail size={12} />{client.email}</span>}
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-lilac-light/30" />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); handleDelete(client.id, client.name); }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-lilac-light/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <AnimatePresence>
            {selectedClient ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-neon to-pink-neon flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{selectedClient.name.charAt(0)}</span>
                    </div>
                    <div><h3 className="text-white font-bold text-lg">{selectedClient.name}</h3></div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(selectedClient.id, selectedClient.name)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                    <button onClick={() => setSelectedClient(null)} className="p-2 rounded-lg hover:bg-abyss-100 text-lilac-light/50 hover:text-lilac-light">
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-lilac-light/60 text-sm"><Phone size={14} /><span>{selectedClient.phone}</span></div>
                  {selectedClient.email && <div className="flex items-center gap-2 text-lilac-light/60 text-sm"><Mail size={14} /><span>{selectedClient.email}</span></div>}
                  {selectedClient.notes && <p className="text-lilac-light/40 text-sm italic">"{selectedClient.notes}"</p>}
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 flex items-center justify-center text-center">
                <div><Users size={48} className="text-lilac-light/20 mx-auto mb-3" /><p className="text-lilac-light/40">Selecione um cliente</p></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <NewClientModal isOpen={modalOpen} onClose={handleModalClose} />
    </motion.div>
  );
}
