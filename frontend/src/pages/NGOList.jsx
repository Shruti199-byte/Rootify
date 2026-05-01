import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { LoadingSpinner, ErrorMessage } from '../components/UI';
import {
  Search,
  MapPin,
  Filter,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const CATEGORIES = [
  'education',
  'environment',
  'health',
  'poverty',
  'animals',
  'arts',
  'community',
  'disaster-relief',
  'human-rights',
  'technology',
  'youth',
  'elderly',
  'other',
];

const DUMMY_NGOS = [
  {
    id: 'demo-green',
    name: 'Green Earth Foundation',
    description:
      'Working for environment protection, tree plantation, and clean communities.',
    location: 'Delhi',
    category: 'environment',
    is_verified: true,
    average_rating: 4.8,
    total_reviews: 24,
  },
  {
    id: 'demo-teach',
    name: 'Teach For Hope',
    description:
      'Helping underprivileged children with education and mentorship.',
    location: 'Chandigarh',
    category: 'education',
    is_verified: true,
    average_rating: 4.6,
    total_reviews: 18,
  },
  {
    id: 'demo-care',
    name: 'Care Hands NGO',
    description:
      'Supporting health camps, food drives, and community welfare.',
    location: 'Shimla',
    category: 'health',
    is_verified: false,
    average_rating: 4.3,
    total_reviews: 11,
  },
];

export default function NGOList() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNgos = async () => {
    setLoading(true);
    setError('');

    try {
      const params = { page, limit: 12 };

      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (location.trim()) params.location = location.trim();

      const res = await api.get('/api/ngos/', { params });
      const items = res.data?.items || [];

      if (items.length > 0) {
        setNgos(items);
        setTotalPages(res.data?.pages || 1);
      } else {
        setNgos(DUMMY_NGOS);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to load NGOs:', err.response?.data || err.message);
      setNgos(DUMMY_NGOS);
      setTotalPages(1);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNgos();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Discover <span className="gradient-text">NGOs</span>
        </h1>
        <p className="text-slate-400">
          Find organizations making a difference in your community and beyond.
        </p>
      </div>

      <div className="glass-card p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="input-field !pl-10"
              placeholder="Search NGOs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="input-field !pl-10 md:w-48"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <select
            className="input-field md:w-48"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>

          <button type="submit" className="btn-primary flex items-center gap-2">
            <Filter size={16} /> Search
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchNgos} />
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ngos.map((ngo) => (
              <Link
                key={ngo.id}
                to={`/ngos/${ngo.id}`}
                className="glass-card p-6 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 group block"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/20 to-indigo-500/20 flex items-center justify-center text-2xl font-bold text-emerald-400">
                    {ngo.name?.[0] || 'N'}
                  </div>

                  {ngo.is_verified && (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs">
                      <CheckCircle size={14} /> Verified
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-1 group-hover:text-emerald-400 transition-colors">
                  {ngo.name}
                </h3>

                <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                  {ngo.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} /> {ngo.location}
                  </div>

                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400" />
                    {Number(ngo.average_rating || 0).toFixed(1)} (
                    {ngo.total_reviews || 0})
                  </div>
                </div>

                <div className="mt-3">
                  <span className="badge badge-info">{ngo.category}</span>
                </div>
              </Link>
            ))}
          </div>

          {ngos.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              No NGOs found. Try different search criteria.
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary !py-2 !px-4 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-slate-400 text-sm">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary !py-2 !px-4 disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}