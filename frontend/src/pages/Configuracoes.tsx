import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Palette,
  Globe,
  Save,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import api from '../lib/api';

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState('perfil');
  
  const [name, setName] = useState('Administrador');
  const [email, setEmail] = useState('admin@barbeariapremium.com');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await api.put('/auth/profile', { name, email, phone, address });
      setProfileMsg('Perfil atualizado com sucesso!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (error) {
      setProfileMsg('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMsg('');
    setPasswordError(false);

    if (newPassword.length < 8) {
      setPasswordMsg('A nova senha deve ter pelo menos 8 caracteres');
      setPasswordError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg('As senhas não coincidem');
      setPasswordError(true);
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword,
        newPassword,
      });
      setPasswordMsg('Senha alterada com sucesso!');
      setPasswordError(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(''), 3000);
    } catch (error: any) {
      setPasswordMsg(error.response?.data?.error || 'Erro ao alterar senha');
      setPasswordError(true);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: User, label: 'Perfil', id: 'perfil' },
    { icon: Shield, label: 'Segurança', id: 'seguranca' },
    { icon: Palette, label: 'Aparência', id: 'aparencia' },
    { icon: Globe, label: 'Idioma', id: 'idioma' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-lilac-light/50 mt-1">Gerencie as preferências do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-4 space-y-1 h-fit">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-purple-neon/20 border border-purple-neon/30 text-purple-neon'
                  : 'text-lilac-light/60 hover:text-lilac-light hover:bg-abyss-100/50'
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'perfil' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User size={20} className="text-purple-neon" /> Informações do Perfil
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-neon to-pink-neon flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">A</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Administrador</h3>
                  <p className="text-lilac-light/40 text-sm">admin@barbeariapremium.com</p>
                  <button className="text-purple-neon text-sm mt-1 hover:underline">Alterar foto</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-lilac-light/60 mb-2">Nome</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-premium w-full" />
                </div>
                <div>
                  <label className="block text-sm text-lilac-light/60 mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-premium w-full" />
                </div>
                <div>
                  <label className="block text-sm text-lilac-light/60 mb-2">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-lilac-light/30 w-4 h-4" />
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" className="input-premium w-full pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-lilac-light/60 mb-2">Endereço</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-lilac-light/30 w-4 h-4" />
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número, bairro" className="input-premium w-full pl-10" />
                  </div>
                </div>
              </div>
              {profileMsg && (
                <p className="mt-4 text-green-400 text-sm flex items-center gap-1">
                  <CheckCircle size={14} /> {profileMsg}
                </p>
              )}
              <div className="mt-6 flex justify-end">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleUpdateProfile} disabled={loading} className="btn-premium flex items-center gap-2">
                  <Save size={18} /> {loading ? 'Salvando...' : 'Salvar Alterações'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'seguranca' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield size={20} className="text-pink-neon" /> Alterar Senha
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-lilac-light/60 mb-2">Senha Atual</label>
                  <div className="relative">
                    <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Digite sua senha atual" className="input-premium w-full pr-10" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-lilac-light/40 hover:text-lilac-light">
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-lilac-light/60 mb-2">Nova Senha</label>
                  <div className="relative">
                    <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres" className="input-premium w-full pr-10" />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-lilac-light/40 hover:text-lilac-light">
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-lilac-light/60 mb-2">Confirmar Nova Senha</label>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha" className="input-premium w-full pr-10" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-lilac-light/40 hover:text-lilac-light">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                {passwordMsg && (
                  <p className={`text-sm flex items-center gap-1 ${passwordError ? 'text-red-400' : 'text-green-400'}`}>
                    {passwordError ? <XCircle size={14} /> : <CheckCircle size={14} />} {passwordMsg}
                  </p>
                )}
                <div className="flex justify-end pt-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleChangePassword} disabled={loading || !currentPassword || !newPassword || !confirmPassword} className="btn-premium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Shield size={18} /> {loading ? 'Alterando...' : 'Alterar Senha'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'aparencia' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Palette size={20} className="text-purple-neon" /> Aparência
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-lilac-light/60 mb-2">Tema</label>
                  <select className="input-premium w-full">
                    <option>Galaxy Dream (Roxo/Rosa)</option>
                    <option>Dark Mode</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'idioma' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe size={20} className="text-purple-neon" /> Idioma
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-lilac-light/60 mb-2">Idioma do Sistema</label>
                  <select className="input-premium w-full">
                    <option>Português (Brasil)</option>
                    <option>English (US)</option>
                    <option>Español</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
