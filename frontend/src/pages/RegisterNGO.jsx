import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function RegisterNGO() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        category: '',
        contact_email: '',
        contact_phone: '',
        website: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/api/ngos/', formData);

            const updatedUser = {
                ...user,
                role: 'ngo_admin',
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));

            navigate('/dashboard');
            window.location.reload();
        } catch (err) {
            console.error('NGO register error:', err.response?.data || err.message);
            setError(err.response?.data?.detail || 'Failed to register NGO. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role === 'ngo_admin') {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-200">
                    You already manage an NGO.
                </h2>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
            <h1 className="text-3xl font-bold mb-6 text-white">Register your NGO</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Organization Name *
                    </label>
                    <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Category *
                    </label>
                    <select
                        required
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none"
                    >
                        <option value="">Select a category...</option>
                        <option value="education">Education</option>
                        <option value="environment">Environment</option>
                        <option value="health">Health</option>
                        <option value="poverty">Poverty</option>
                        <option value="community">Community</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Description *
                    </label>
                    <textarea
                        required
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Location *
                        </label>
                        <input
                            required
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Contact Email *
                        </label>
                        <input
                            required
                            type="email"
                            name="contact_email"
                            value={formData.contact_email}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Contact Phone
                        </label>
                        <input
                            type="text"
                            name="contact_phone"
                            value={formData.contact_phone}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Website URL
                        </label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
                >
                    {loading ? 'Registering...' : 'Register NGO'}
                </button>
            </form>
        </div>
    );
}