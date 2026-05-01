import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/UI';
import { Bell, Check, CheckCheck } from 'lucide-react';

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifs(); }, []);
  const loadNotifs = () => {
    api.get('/api/notifications').then(r => setNotifs(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  const markRead = async (id) => {
    await api.put(`/api/notifications/${id}/read`);
    loadNotifs();
  };

  const markAllRead = async () => {
    await api.put('/api/notifications/read-all');
    loadNotifs();
  };

  const typeIcons = { application: '📋', message: '💬', review: '⭐', general: '🔔' };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {notifs.some(n => !n.is_read) && (
          <button onClick={markAllRead} className="btn-secondary text-sm flex items-center gap-1"><CheckCheck size={14} /> Mark All Read</button>
        )}
      </div>

      <div className="space-y-3">
        {notifs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Bell size={48} className="mx-auto mb-3 opacity-50" />
            <p>No notifications</p>
          </div>
        ) : notifs.map(n => (
          <div key={n.id} className={`glass-card p-4 flex items-start gap-4 cursor-pointer hover:border-slate-600 transition-colors ${!n.is_read ? 'border-emerald-500/30' : ''}`}
            onClick={() => { if (!n.is_read) markRead(n.id); if (n.link) navigate(n.link); }}>
            <span className="text-2xl">{typeIcons[n.type] || '🔔'}</span>
            <div className="flex-1">
              <p className={`font-medium text-sm ${!n.is_read ? 'text-white' : 'text-slate-300'}`}>{n.title}</p>
              {n.content && <p className="text-xs text-slate-400 mt-0.5">{n.content}</p>}
              <p className="text-xs text-slate-500 mt-1">{new Date(n.created_at).toLocaleString()}</p>
            </div>
            {!n.is_read && <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full mt-1.5 shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
