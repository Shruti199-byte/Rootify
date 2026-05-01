import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, ErrorMessage, StarRating } from '../components/UI';
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  Clock,
  Send,
} from 'lucide-react';

const DEMO_NGOS = {
  'demo-green': {
    id: 'demo-green',
    name: 'Green Earth Foundation',
    description:
      'Working for environment protection, tree plantation, and clean communities.',
    location: 'Delhi',
    category: 'environment',
    contact_email: 'greenearth@example.com',
    contact_phone: '9876543210',
    website: '',
    is_verified: true,
    average_rating: 4.8,
    total_reviews: 24,
  },
  'demo-teach': {
    id: 'demo-teach',
    name: 'Teach For Hope',
    description:
      'Helping underprivileged children with education and mentorship.',
    location: 'Chandigarh',
    category: 'education',
    contact_email: 'teachforhope@example.com',
    contact_phone: '9876543210',
    website: '',
    is_verified: true,
    average_rating: 4.6,
    total_reviews: 18,
  },
  'demo-care': {
    id: 'demo-care',
    name: 'Care Hands NGO',
    description:
      'Supporting health camps, food drives, and community welfare.',
    location: 'Shimla',
    category: 'health',
    contact_email: 'carehands@example.com',
    contact_phone: '9876543210',
    website: '',
    is_verified: false,
    average_rating: 4.3,
    total_reviews: 11,
  },
};

const DEMO_OPPS = {
  'demo-green': [
    {
      id: 'demo-opp-green-1',
      title: 'Weekend Cleanliness Drive',
      description: 'Join volunteers to clean public spaces and spread awareness.',
      time_commitment: '3 hours/week',
    },
  ],
  'demo-teach': [
    {
      id: 'demo-opp-teach-1',
      title: 'Teaching Volunteer',
      description: 'Help children with basic English, computer skills, and homework.',
      time_commitment: '4 hours/week',
    },
  ],
  'demo-care': [
    {
      id: 'demo-opp-care-1',
      title: 'Health Camp Support Volunteer',
      description: 'Assist in organizing health camps and food distribution.',
      time_commitment: '2 hours/week',
    },
  ],
};

export default function NGODetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [ngo, setNgo] = useState(null);
  const [opps, setOpps] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('about');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [applyingId, setApplyingId] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchNgoDetails = async () => {
      setLoading(true);
      setError('');
      setMsg('');

      try {
        if (String(id).startsWith('demo-')) {
          setNgo(DEMO_NGOS[id]);
          setOpps(DEMO_OPPS[id] || []);
          setReviews([]);
          return;
        }

        const ngoRes = await api.get(`/api/ngos/${id}`);
        setNgo(ngoRes.data);

        const oppRes = await api.get('/api/opportunities/', {
          params: { ngo_id: id },
        });

        setOpps(Array.isArray(oppRes.data) ? oppRes.data : []);
        setReviews([]);
      } catch (err) {
        console.error('Failed to load NGO:', err.response?.data || err.message);
        setError('Failed to load NGO');
      } finally {
        setLoading(false);
      }
    };

    fetchNgoDetails();
  }, [id]);

  const handleApply = async (oppId) => {
    try {
      setMsg('');

      if (String(oppId).startsWith('demo-')) {
        setMsg('This is demo NGO data. Create a real NGO/opportunity to save applications.');
        setApplyingId(null);
        setCoverLetter('');
        return;
      }

      await api.post('/api/applications/', {
        opportunity_id: oppId,
      });

      setMsg('Application submitted successfully!');
      setApplyingId(null);
      setCoverLetter('');
    } catch (err) {
      console.error('Apply error:', err.response?.data || err.message);
      setMsg(err.response?.data?.detail || 'Failed to submit application');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setMsg('Review feature will be connected in the next phase.');
    setReviewForm({ rating: 5, comment: '' });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!ngo) return <ErrorMessage message="NGO not found" />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {msg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm mb-6">
          {msg}
        </div>
      )}

      <div className="glass-card p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-indigo-500/20 flex items-center justify-center text-4xl font-bold text-emerald-400 shrink-0">
            {ngo.name?.[0] || 'N'}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{ngo.name}</h1>
              {ngo.is_verified && (
                <span className="flex items-center gap-1 badge badge-success">
                  <CheckCircle size={12} /> Verified
                </span>
              )}
            </div>

            <p className="text-slate-400 mb-4">{ngo.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {ngo.location}
              </span>

              {ngo.contact_email && (
                <span className="flex items-center gap-1">
                  <Mail size={14} /> {ngo.contact_email}
                </span>
              )}

              {ngo.contact_phone && (
                <span className="flex items-center gap-1">
                  <Phone size={14} /> {ngo.contact_phone}
                </span>
              )}

              {ngo.website && (
                <a
                  href={ngo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-400 hover:underline"
                >
                  <Globe size={14} /> Website
                </a>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4">
              <span className="badge badge-info">{ngo.category}</span>
              <div className="flex items-center gap-1">
                <StarRating rating={Math.round(ngo.average_rating || 0)} />
                <span className="text-sm text-slate-400">
                  ({ngo.total_reviews || 0})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-xl p-1">
        {['about', 'opportunities', 'reviews'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${tab === t
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}{' '}
            {t === 'opportunities'
              ? `(${opps.length})`
              : t === 'reviews'
                ? `(${reviews.length})`
                : ''}
          </button>
        ))}
      </div>

      {tab === 'about' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">About {ngo.name}</h3>
          <p className="text-slate-300 whitespace-pre-wrap">
            {ngo.description}
          </p>
        </div>
      )}

      {tab === 'opportunities' && (
        <div className="space-y-4">
          {opps.length === 0 ? (
            <div className="glass-card p-8 text-center text-slate-400">
              No active opportunities yet.
            </div>
          ) : (
            opps.map((opp) => (
              <div key={opp.id} className="glass-card p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{opp.title}</h3>
                  <span className="badge badge-success">Active</span>
                </div>

                <p className="text-slate-400 text-sm mb-3">
                  {opp.description}
                </p>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {opp.time_commitment}
                  </span>
                </div>

                {user && applyingId === opp.id ? (
                  <div className="space-y-3">
                    <textarea
                      className="input-field"
                      rows={3}
                      placeholder="Cover letter (optional)"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApply(opp.id)}
                        className="btn-primary text-sm"
                      >
                        <Send size={14} className="inline mr-1" /> Submit
                      </button>

                      <button
                        onClick={() => setApplyingId(null)}
                        className="btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : user ? (
                  <button
                    onClick={() => setApplyingId(opp.id)}
                    className="btn-primary text-sm"
                  >
                    Apply Now
                  </button>
                ) : (
                  <p className="text-sm text-slate-400">
                    Please log in to apply.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="space-y-4">
          {user && (
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Write a Review</h3>

              <form onSubmit={handleReview} className="space-y-4">
                <StarRating
                  rating={reviewForm.rating}
                  onRate={(r) => setReviewForm({ ...reviewForm, rating: r })}
                  interactive
                />

                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      comment: e.target.value,
                    })
                  }
                />

                <button type="submit" className="btn-primary text-sm">
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="glass-card p-8 text-center text-slate-400">
              No reviews yet.
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="glass-card p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{r.user_name}</span>
                  <StarRating rating={r.rating} size="sm" />
                </div>

                <p className="text-slate-400 text-sm">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}