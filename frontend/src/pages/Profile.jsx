import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/UI';
import { Clock, Building2, Target, User, Edit3, Save, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for tracking which application's hours are currently being edited
  const [editingId, setEditingId] = useState(null);
  const [editHours, setEditHours] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // The backend endpoint we verified earlier gets all apps for the current user
      const res = await api.get('/api/applications/my');
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHours = async (appId) => {
    try {
      const hours = parseFloat(editHours);
      if (isNaN(hours) || hours < 0) return alert("Please enter a valid number of hours.");

      // Send the update to the backend
      const res = await api.put(`/api/applications/${appId}`, { hours_contributed: hours });

      // Update UI
      setApplications(applications.map(app => app.id === appId ? { ...app, hours_contributed: res.data.hours_contributed } : app));
      setEditingId(null);
      setEditHours('');
    } catch (err) {
      alert("Failed to update hours. Make sure you have permission.");
    }
  };

  if (loading) return <LoadingSpinner />;

  // Derived Statistics for the Portfolio
  const acceptedApps = applications.filter(app => app.status === 'accepted' || app.status === 'completed');
  const totalHours = acceptedApps.reduce((sum, app) => sum + (app.hours_contributed || 0), 0);

  // Get unique NGOs the user has worked with
  const uniqueNGOs = new Set(acceptedApps.map(app => app.ngo_name));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* PROFILE HEADER */}
      <div className="glass-card p-8 rounded-2xl mb-8 border border-slate-700/50 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-emerald-500/20 shrink-0">
          {user?.full_name ? user.full_name[0].toUpperCase() : <User size={40} />}
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-white mb-1">{user?.full_name}</h1>
          <p className="text-slate-400 mb-2">@{user?.username} • {user?.email}</p>
          <div className="inline-block px-3 py-1 bg-slate-800 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-400 border border-slate-700">
            {user?.role === 'ngo_admin' ? 'NGO Administrator' : 'Community Volunteer'}
          </div>
        </div>
      </div>

      {/* PORTFOLIO STATS GRID */}
      <h2 className="text-xl font-bold text-white mb-4">Volunteer Impact</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg"><Clock size={24} /></div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Hours Contributed</p>
            <p className="text-2xl font-bold text-white">{totalHours.toFixed(1)}</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-lg"><Building2 size={24} /></div>
          <div>
            <p className="text-sm text-slate-400 font-medium">NGOs Supported</p>
            <p className="text-2xl font-bold text-white">{uniqueNGOs.size}</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg"><Target size={24} /></div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Projects Accepted</p>
            <p className="text-2xl font-bold text-white">{acceptedApps.length}</p>
          </div>
        </div>
      </div>

      {/* APPLICATION HISTORY */}
      <h2 className="text-xl font-bold text-white mb-4">Application History & Time Tracking</h2>
      {applications.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-xl border border-slate-700/50 text-slate-400">
          You haven't applied to any opportunities yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="glass-card p-6 rounded-xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:border-slate-600">

              {/* App Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-white">{app.opportunity_title}</h3>
                  {app.status === 'accepted' && <CheckCircle size={16} className="text-emerald-500" />}
                  {app.status === 'rejected' && <XCircle size={16} className="text-red-500" />}
                  {app.status === 'pending' && <AlertCircle size={16} className="text-amber-500" />}
                </div>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <Building2 size={14} /> {app.ngo_name}
                </p>
                <p className="text-xs text-slate-500 mt-2">Applied on: {new Date(app.created_at).toLocaleDateString()}</p>
              </div>

              {/* Status & Hours Logging */}
              <div className="flex flex-col items-start md:items-end gap-3 min-w-[200px] border-t border-slate-700/50 pt-4 md:border-t-0 md:pt-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${app.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                    app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                  }`}>
                  {app.status}
                </span>

                {/* Only allow hour logging if accepted */}
                {app.status === 'accepted' && (
                  <div className="w-full bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    {editingId === app.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={editHours}
                          onChange={(e) => setEditHours(e.target.value)}
                          className="w-20 p-1.5 rounded bg-slate-900 border border-emerald-500 text-white text-sm outline-none"
                          placeholder="Hrs"
                          autoFocus
                        />
                        <button onClick={() => handleUpdateHours(app.id)} className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-500"><Save size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-700 text-white rounded hover:bg-slate-600"><XCircle size={14} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-slate-300">
                          {app.hours_contributed} <span className="text-slate-500 font-normal">hrs logged</span>
                        </span>
                        <button onClick={() => { setEditingId(app.id); setEditHours(app.hours_contributed); }} className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-xs font-semibold">
                          <Edit3 size={12} /> Log Time
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}