import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { LoadingSpinner } from '../components/UI';
import { Plus, Trash2, MapPin, Clock, Briefcase } from 'lucide-react';

export default function ManageOpportunities() {
    const { user } = useAuth();
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formError, setFormError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        time_commitment: '',
        skills_required: ''
    });

    // Fetch opportunities on load
    const fetchOpportunities = async () => {
        try {
            // The backend will return all active opportunities. 
            // Note: In a fully scaled app, you'd want a dedicated /api/opportunities/my endpoint,
            // but we can filter on the frontend for MVP if needed, or just fetch the general list.
            const res = await api.get('/api/opportunities/?active_only=false');

            // Filter to only show opportunities created by this NGO owner
            // (Assuming the backend returns ngo_id and your user object knows its NGO, 
            // or we just show the ones that don't throw 403 on edit/delete)
            setOpportunities(res.data);
        } catch (error) {
            console.error("Failed to fetch opportunities", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            await api.post('/api/opportunities/', formData);
            setIsModalOpen(false);
            setFormData({ title: '', description: '', location: '', time_commitment: '', skills_required: '' });
            fetchOpportunities(); // Refresh the list
        } catch (error) {
            setFormError(error.response?.data?.detail || 'Failed to create opportunity');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this opportunity?")) return;
        try {
            await api.delete(`/api/opportunities/${id}`);
            setOpportunities(opportunities.filter(opp => opp.id !== id));
        } catch (error) {
            alert("Failed to delete. You might not have permission.");
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700/50">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Manage Opportunities</h1>
                    <p className="text-slate-400">Create and manage your volunteer listings.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    New Listing
                </button>
            </div>

            {/* Opportunities Grid */}
            {opportunities.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl border border-slate-700/50">
                    <p className="text-slate-400">You haven't posted any opportunities yet.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.map((opp) => (
                        <div key={opp.id} className="glass-card p-6 rounded-xl border border-slate-700/50 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-lg text-white leading-tight">{opp.title}</h3>
                                    <button onClick={() => handleDelete(opp.id)} className="text-red-400 hover:text-red-300 p-1">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{opp.description}</p>

                                <div className="space-y-2 text-sm text-slate-300 mb-6">
                                    <div className="flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> {opp.location || 'Remote'}</div>
                                    <div className="flex items-center gap-2"><Clock size={16} className="text-emerald-500" /> {opp.time_commitment}</div>
                                    {opp.skills_required && (
                                        <div className="flex items-center gap-2"><Briefcase size={16} className="text-emerald-500" /> <span className="truncate">{opp.skills_required}</span></div>
                                    )}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-700/50">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${opp.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                                    {opp.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Create Opportunity</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
                        </div>

                        {formError && <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded border border-red-500/50 text-sm">{formError}</div>}

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Title *</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none" placeholder="e.g. Weekend Park Cleanup" />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Description *</label>
                                <textarea required name="description" rows="3" value={formData.description} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none" placeholder="What will volunteers be doing?"></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-300 mb-1">Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none" placeholder="Address or 'Remote'" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-300 mb-1">Time Commitment *</label>
                                    <input required type="text" name="time_commitment" value={formData.time_commitment} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none" placeholder="e.g. 4 hours/week" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Skills Required</label>
                                <input type="text" name="skills_required" value={formData.skills_required} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none" placeholder="e.g. Coding, Teaching, Gardening" />
                            </div>

                            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700/50">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors">Post Listing</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}