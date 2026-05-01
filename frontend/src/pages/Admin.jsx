import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/UI';
import { Shield, Users, Building2, CheckCircle, XCircle } from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    Promise.all([
      api.get('/api/admin/stats'),
      api.get('/api/admin/ngos'),
      api.get('/api/admin/users'),
    ]).then(([s, n, u]) => {
      setStats(s.data); setNgos(n.data); setUsers(u.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const toggleVerify = async (ngoId) => {
    await api.post(`/api/ngos/${ngoId}/verify`);
    const res = await api.get('/api/admin/ngos');
    setNgos(res.data);
  };

  const updateRole = async (userId, role) => {
    await api.put(`/api/admin/users/${userId}/role?role=${role}`);
    const res = await api.get('/api/admin/users');
    setUsers(res.data);
  };

  if (user?.role !== 'admin') return <div className="text-center py-20 text-slate-400">Admin access required</div>;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-amber-400" size={28} />
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-xl p-1">
        {['stats', 'ngos', 'users'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${tab === t ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Users className="text-emerald-400" />} label="Total Users" value={stats.total_users} />
          <StatCard icon={<Building2 className="text-indigo-400" />} label="Total NGOs" value={stats.total_ngos} />
          <StatCard icon={<CheckCircle className="text-cyan-400" />} label="Verified NGOs" value={stats.verified_ngos} />
          <StatCard icon={<Shield className="text-amber-400" />} label="Applications" value={stats.total_applications} />
        </div>
      )}

      {tab === 'ngos' && (
        <div className="space-y-3">
          {ngos.map(ngo => (
            <div key={ngo.id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{ngo.name}</h3>
                  {ngo.is_verified && <span className="badge badge-success text-xs">Verified</span>}
                </div>
                <p className="text-sm text-slate-400">{ngo.category} · {ngo.location}</p>
              </div>
              <button onClick={() => toggleVerify(ngo.id)} className={`flex items-center gap-1 text-sm cursor-pointer ${ngo.is_verified ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'}`}>
                {ngo.is_verified ? <><XCircle size={14} /> Unverify</> : <><CheckCircle size={14} /> Verify</>}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{u.full_name}</p>
                <p className="text-sm text-slate-400">{u.email}</p>
              </div>
              <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)} className="input-field !w-auto !py-1.5 text-sm">
                <option value="volunteer">Volunteer</option>
                <option value="ngo_admin">NGO Admin</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="glass-card p-5 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
