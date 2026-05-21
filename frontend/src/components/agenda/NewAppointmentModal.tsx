import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Scissors } from 'lucide-react';
import api from '../../lib/api';

interface Props {
  isOpen: boolean;
  onClose: (refresh?: boolean) => void;
}

export default function NewAppointmentModal({ isOpen, onClose }: Props) {
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [barbers] = useState<any[]>([
    { id: '118adc22-8090-4cb8-b55e-e5b6ce75d4f7', name: 'Ricardo Silva' },
    { id: '6855989f-4ee7-4bb3-98c1-e3179d840659', name: 'Carlos Oliveira' },
  ]);
  
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
      // Preencher data de hoje
      const today = new Date();
      setDate(today.toISOString().split('T')[0]);
      setTime('09:00');
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [clientsRes, servicesRes] = await Promise.all([
        api.get('/clients?limit=100'),
        api.get('/services'),
      ]);
      setClients(clientsRes.data.clients || []);
      setServices(servicesRes.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || !selectedService || !selectedBarber || !date || !time) {
      setMessage('❌ Preencha todos os campos!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Criar data ISO correta com fuso horário
      const dateTimeStr = `${date}T${time}:00`;
      const localDate = new Date(dateTimeStr);
      const isoDate = localDate.toISOString();

      await api.post('/appointments', {
        date: isoDate,
        clientId: selectedClient,
        serviceId: selectedService,
        userId: selectedBarber,
        notes: notes,
        price: Number(services.find(s => s.id === selectedService)?.price || 0),
      });
      
      setMessage('✅ Agendamento criado com sucesso!');
      setTimeout(() => {
        onClose(true);
        setMessage('');
      }, 1000);
    } catch (error: any) {
      setMessage('❌ ' + (error.response?.data?.error || 'Erro ao criar agendamento'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => onClose(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="glass-strong p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calendar size={22} className="text-purple-neon" /> Novo Agendamento</h2>
              <button onClick={() => onClose(false)} className="text-lilac-light/50 hover:text-white"><X size={22} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-lilac-light/60 mb-1">Cliente</label>
                <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="input-premium w-full" required>
                  <option value="">Selecione um cliente...</option>
                  {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-lilac-light/60 mb-1">Serviço</label>
                <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="input-premium w-full" required>
                  <option value="">Selecione um serviço...</option>
                  {services.map((s: any) => <option key={s.id} value={s.id}>{s.name} - R$ {Number(s.price).toFixed(2)}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-lilac-light/60 mb-1">Barbeiro</label>
                <select value={selectedBarber} onChange={(e) => setSelectedBarber(e.target.value)} className="input-premium w-full" required>
                  <option value="">Selecione um barbeiro...</option>
                  {barbers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-lilac-light/60 mb-1">Data</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-premium w-full" required />
                </div>
                <div>
                  <label className="block text-sm text-lilac-light/60 mb-1">Horário</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-premium w-full" required />
                </div>
              </div>

              <div>
                <label className="block text-sm text-lilac-light/60 mb-1">Observações</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observações (opcional)" className="input-premium w-full h-16 resize-none" />
              </div>

              {message && <p className={`text-sm ${message.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}

              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-premium w-full flex items-center justify-center gap-2 disabled:opacity-50">
                <Calendar size={18} /> {loading ? 'Criando...' : 'Criar Agendamento'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
