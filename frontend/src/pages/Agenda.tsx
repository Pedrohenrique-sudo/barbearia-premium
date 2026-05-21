import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Scissors, Plus, Trash2 } from 'lucide-react';
import NewAppointmentModal from '../components/agenda/NewAppointmentModal';
import api from '../lib/api';

interface Appointment {
  id: string;
  date: string;
  status: string;
  notes: string | null;
  price: string;
  client: { id: string; name: string; phone: string };
  service: { id: string; name: string; price: string; duration: number };
  user: { id: string; name: string };
}

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [modalOpen, setModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return date;
  });

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await api.get(`/appointments?date=${dateStr}&limit=50`);
      setAppointments(res.data.appointments || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const handleModalClose = (refresh?: boolean) => {
    setModalOpen(false);
    if (refresh) loadAppointments();
  };

  const handleDelete = async (id: string, clientName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o agendamento de ${clientName}?`)) return;
    try {
      await api.delete(`/appointments/${id}`);
      loadAppointments();
    } catch (error) {
      alert('Erro ao excluir agendamento');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'SCHEDULED': return 'bg-purple-neon/10 border-purple-neon/20 text-purple-neon';
      case 'COMPLETED': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'CANCELLED': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-abyss-100 border-purple-neon/5 text-lilac-light';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmado';
      case 'SCHEDULED': return 'Agendado';
      case 'COMPLETED': return 'Concluído';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agenda</h1>
          <p className="text-lilac-light/50 mt-1">Gerencie seus horários</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setModalOpen(true)}
          className="btn-premium flex items-center gap-2"
        >
          <Plus size={20} /> Novo Agendamento
        </motion.button>
      </div>

      {/* Calendário */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">
            {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setView('day')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'day' ? 'bg-purple-neon text-white' : 'text-lilac-light hover:bg-abyss-100'}`}>Dia</button>
            <button onClick={() => setView('week')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'week' ? 'bg-purple-neon text-white' : 'text-lilac-light hover:bg-abyss-100'}`}>Semana</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-xl text-center transition-all ${
                  isSelected ? 'bg-purple-neon text-white' : isToday ? 'bg-purple-neon/20 text-purple-neon border border-purple-neon/30' : 'hover:bg-abyss-100 text-lilac-light'
                }`}
              >
                <p className="text-xs font-medium">{daysOfWeek[date.getDay()]}</p>
                <p className="text-lg font-bold">{date.getDate()}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="glass-card p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Clock size={20} className="text-purple-neon" />
          {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h3>

        {loading ? (
          <div className="text-center text-lilac-light/40 py-10">Carregando...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-lilac-light/40 py-10">
            <Calendar size={40} className="mx-auto mb-2 opacity-30" />
            <p>Nenhum agendamento para esta data</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border transition-all group ${getStatusColor(app.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-neon/20 to-pink-neon/20 flex items-center justify-center">
                      <User size={18} className="text-purple-neon" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{app.client.name}</p>
                      <div className="flex items-center gap-2 text-sm opacity-70">
                        <Scissors size={12} />
                        <span>{app.service.name}</span>
                        <span>•</span>
                        <span>{new Date(app.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-white font-semibold text-sm">R$ {Number(app.price).toFixed(2)}</p>
                      <p className="text-xs opacity-70">{app.user.name}</p>
                    </div>
                    <span className="badge-purple text-xs">{getStatusLabel(app.status)}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(app.id, app.client.name)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <NewAppointmentModal isOpen={modalOpen} onClose={handleModalClose} />
    </motion.div>
  );
}
