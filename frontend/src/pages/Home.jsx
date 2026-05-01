import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Users,
  Building2,
  Heart,
  Globe,
  Shield,
  MessageSquare,
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  const features = [
    { icon: <Building2 className="text-emerald-400" size={26} />, title: 'Discover NGOs', desc: 'Find organizations aligned with your passion.', link: '/ngos' },
    { icon: <Heart className="text-pink-400" size={26} />, title: 'Volunteer', desc: 'Apply to opportunities and track impact.', link: '/register' },
    { icon: <MessageSquare className="text-indigo-400" size={26} />, title: 'Connect', desc: 'Chat directly with NGOs.', link: '/chat' },
    { icon: <Shield className="text-amber-400" size={26} />, title: 'Verified NGOs', desc: 'Trust safe organizations.', link: '/ngos' },
    { icon: <Globe className="text-cyan-400" size={26} />, title: 'Build Portfolio', desc: 'Showcase your work.', link: '/dashboard' },
    { icon: <Users className="text-violet-400" size={26} />, title: 'Community Feed', desc: 'Share updates & inspire.', link: '/feed' },
  ];

  return (
    <div className="flex flex-col overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-6 pt-20 pb-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10" />

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="mb-6">
            <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm">
              Connecting Volunteers with Purpose
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight whitespace-nowrap text-center">
            Make the World <span className="gradient-text">Better Together</span>
          </h1>

          <p className="text-slate-400 mb-8 text-lg max-w-2xl mx-auto text-center">
            Connect with NGOs, volunteer, and build your social impact portfolio.
          </p>

          <div className="w-full flex justify-center">
            {user ? (
              <Link
                to="/ngos"
                className="btn-primary px-8 py-3 inline-flex items-center justify-center gap-2"
              >
                Explore NGOs <ArrowRight size={18} />
              </Link>
            ) : (
              <div className="flex justify-center gap-4 flex-wrap">
                <Link to="/register" className="btn-primary px-8 py-3">
                  Start Volunteering
                </Link>
                <Link to="/ngos" className="btn-secondary px-8 py-3">
                  Browse NGOs
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="pt-8 pb-16 px-8 text-center">
        <div className="w-full flex flex-col items-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">
            Everything You Need to{' '}
            <span className="gradient-text">Make an Impact</span>
          </h2>

          <p className="text-slate-400 mb-8 max-w-2xl mx-auto text-center">
            A complete platform for volunteers and NGOs.
          </p>

          <div className="w-full flex justify-center">
            <div className="grid grid-cols-6 gap-4 w-[1320px] max-w-full">
              {features.map((f, i) => (
                <Link
                  key={i}
                  to={f.link}
                  className="glass-card h-[112px] px-3 py-4 text-center hover:scale-105 transition flex flex-col items-center justify-center"
                >
                  <div className="mb-2">{f.icon}</div>
                  <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                  <p className="text-slate-400 text-xs leading-snug">{f.desc}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="pt-8 pb-12 px-8 text-center">
        <div className="w-full flex flex-col items-center">

          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
            Ready to Start Your Journey?
          </h2>

          <p className="text-slate-400 text-sm md:text-base mb-6 text-center">
            Join volunteers and make a difference today.
          </p>

          <Link
            to={user ? '/ngos' : '/register'}
            className="btn-primary px-7 py-3 inline-flex items-center justify-center gap-2 text-sm"
          >
            {user ? 'Find Opportunities' : 'Join Rootify'}
            <ArrowRight size={16} />
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/50 px-8 py-6 text-slate-500 text-sm">
        <div className="w-[1320px] max-w-full mx-auto text-left">
          © 2026 Rootify. Built for good.
        </div>
      </footer>

    </div>
  );
}