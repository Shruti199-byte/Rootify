import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, StatusBadge } from '../components/UI';
import { Award, Clock, Building2, CheckCircle } from 'lucide-react';

export default function Portfolio() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHours, setEditingHours] = useState(null);
  const [hours, setHours] = useState('');

  useEffect(() => {
    api.get('/api/applications/my').then(r => setApps(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateHours = async (appId) => {
    try {
      await api.put(`/api/applications/${appId}`, { hours_contributed: parseFloat(hours) });
      const res = await api.get('/api/applications/my');
      setApps(res.data);
      setEditingHours(null);
    } catch {}
  };

  const totalHours = apps.reduce((sum, a) => sum + (a.hours_contributed || 0), 0);
  const completed = apps.filter(a => a.status === 'completed').length;
  const accepted = apps.filter(a => a.status === 'accepted').length;
  const uniqueNgos = new Set(apps.filter(a => ['accepted', 'completed'].includes(a.status)).map(a => a.ngo_name)).size;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Volunteer Portfolio</h1>
      <p className="text-slate-400 mb-8">Track your impact and contributions</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5 text-center">
          <Clock className="mx-auto mb-2 text-emerald-400" size={28} />
          <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
          <p className="text-xs text-slate-400">Hours Contributed</p>
        </div>
        <div className="glass-card p-5 text-center">
          <Building2 className="mx-auto mb-2 text-indigo-400" size={28} />
          <p className="text-2xl font-bold">{uniqueNgos}</p>
          <p className="text-xs text-slate-400">NGOs Worked With</p>
        </div>
        <div className="glass-card p-5 text-center">
          <CheckCircle className="mx-auto mb-2 text-cyan-400" size={28} />
          <p className="text-2xl font-bold">{completed}</p>
          <p className="text-xs text-slate-400">Completed</p>
        </div>
        <div className="glass-card p-5 text-center">
          <Award className="mx-auto mb-2 text-amber-400" size={28} />
          <p className="text-2xl font-bold">{accepted + completed}</p>
          <p className="text-xs text-slate-400">Active & Done</p>
        </div>
      </div>

      {/* Application History */}
      <h2 className="text-xl font-semibold mb-4">Volunteer History</h2>
      <div className="space-y-4">
        {apps.length === 0 ? <div className="text-center py-12 text-slate-400">No volunteer history yet. <a href="/ngos" className="text-emerald-400">Find opportunities</a></div> : apps.map(app => (
          <div key={app.id} className="glass-card p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">{app.opportunity_title}</h3>
                <p className="text-sm text-slate-400">{app.ngo_name}</p>
                <p className="text-xs text-slate-500 mt-1">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={app.status} />
                <div className="text-right">
                  {editingHours === app.id ? (
                    <div className="flex gap-2 items-center">
                      <input type="number" className="input-field !w-20 !py-1 text-sm" value={hours} onChange={(e) => setHours(e.target.value)} min="0" step="0.5" />
                      <button onClick={() => updateHours(app.id)} className="text-emerald-400 text-sm cursor-pointer">Save</button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditingHours(app.id); setHours(app.hours_contributed.toString()); }} className="text-sm text-slate-400 hover:text-emerald-400 cursor-pointer">
                      <Clock size={14} className="inline mr-1" />{app.hours_contributed}h
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
