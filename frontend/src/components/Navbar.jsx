import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Leaf,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Rss,
  Search,
  Bell,
  CheckCheck,
  Circle,
  Building2,
  ClipboardList,
  Users,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);

  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      api
        .get('/api/notifications/unread-count')
        .then((res) => setUnreadCount(res.data.count || 0))
        .catch(() => setUnreadCount(0));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
    setIsNotifOpen(false);
  };

  const toggleNotifications = async () => {
    const willOpen = !isNotifOpen;
    setIsNotifOpen(willOpen);

    if (willOpen) {
      try {
        const res = await api.get('/api/notifications/');
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch {
        setNotifications([]);
      }
    }
  };

  const handleNotifClick = async (notif) => {
    setIsNotifOpen(false);

    if (!notif.is_read) {
      try {
        await api.put(`/api/notifications/${notif.id}/read`);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications(
          notifications.map((n) =>
            n.id === notif.id ? { ...n, is_read: true } : n
          )
        );
      } catch {
        // ignore
      }
    }

    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      setUnreadCount(0);
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    } catch {
      // ignore
    }
  };

  const isNgoAdmin = user?.role === 'ngo_admin';

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <Leaf size={18} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Rootify
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/ngos"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
            >
              <Search size={16} /> Discover NGOs
            </Link>

            <Link
              to="/feed"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
            >
              <Rss size={16} /> Community Feed
            </Link>

            <div className="h-6 w-px bg-slate-700/50 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <LayoutDashboard size={16} className="text-emerald-500" />
                  Dashboard
                </Link>

                {isNgoAdmin ? (
                  <>
                    <Link
                      to="/ngo/opportunities"
                      className="text-sm font-medium text-emerald-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <ClipboardList size={16} />
                      Manage Opportunities
                    </Link>

                    <Link
                      to="/ngo/applications"
                      className="text-sm font-medium text-emerald-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Users size={16} />
                      Applicants
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/register-ngo"
                    className="text-sm font-medium text-indigo-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Building2 size={16} />
                    Register NGO
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <User size={16} className="text-indigo-400" />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-400 hover:text-red-400 flex items-center gap-1.5 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="text-sm font-medium px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-0">
            {user && (
              <div className="relative md:ml-4" ref={notifRef}>
                <button
                  onClick={toggleNotifications}
                  className="p-2 text-slate-300 hover:text-white relative transition-colors"
                >
                  <Bell size={20} />

                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/80 backdrop-blur-sm">
                      <h3 className="font-semibold text-white">
                        Notifications
                      </h3>

                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <CheckCheck size={14} /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-sm">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotifClick(notif)}
                            className={`p-4 border-b border-slate-700/30 cursor-pointer transition-colors flex gap-3 ${notif.is_read
                                ? 'hover:bg-slate-700/30'
                                : 'bg-slate-700/20 hover:bg-slate-700/40'
                              }`}
                          >
                            <div className="mt-1 shrink-0">
                              {!notif.is_read ? (
                                <Circle
                                  size={10}
                                  className="fill-emerald-500 text-emerald-500"
                                />
                              ) : (
                                <div className="w-2.5" />
                              )}
                            </div>

                            <div>
                              <h4
                                className={`text-sm ${notif.is_read
                                    ? 'text-slate-300 font-medium'
                                    : 'text-white font-semibold'
                                  }`}
                              >
                                {notif.title || 'Notification'}
                              </h4>

                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                {notif.content || notif.message || ''}
                              </p>

                              {notif.created_at && (
                                <span className="text-[10px] text-slate-500 mt-2 block">
                                  {new Date(notif.created_at).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="md:hidden flex items-center ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700 absolute w-full left-0 top-16 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link
              to="/ngos"
              onClick={closeMenu}
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-200 hover:bg-slate-700 hover:text-emerald-400"
            >
              <div className="flex items-center gap-3">
                <Search size={18} /> Discover NGOs
              </div>
            </Link>

            <Link
              to="/feed"
              onClick={closeMenu}
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-200 hover:bg-slate-700 hover:text-emerald-400"
            >
              <div className="flex items-center gap-3">
                <Rss size={18} /> Community Feed
              </div>
            </Link>

            <div className="border-t border-slate-700 my-2 pt-2"></div>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="block px-3 py-3 rounded-md text-base font-medium text-slate-200 hover:bg-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={18} className="text-emerald-500" />
                    Dashboard
                  </div>
                </Link>

                {isNgoAdmin ? (
                  <>
                    <Link
                      to="/ngo/opportunities"
                      onClick={closeMenu}
                      className="block px-3 py-3 rounded-md text-base font-medium text-emerald-400 hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <ClipboardList size={18} />
                        Manage Opportunities
                      </div>
                    </Link>

                    <Link
                      to="/ngo/applications"
                      onClick={closeMenu}
                      className="block px-3 py-3 rounded-md text-base font-medium text-emerald-400 hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <Users size={18} />
                        Applicants
                      </div>
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/register-ngo"
                    onClick={closeMenu}
                    className="block px-3 py-3 rounded-md text-base font-medium text-indigo-400 hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 size={18} />
                      Register NGO
                    </div>
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="block px-3 py-3 rounded-md text-base font-medium text-slate-200 hover:bg-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-indigo-400" />
                    Profile
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-400 hover:bg-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={18} /> Logout
                  </div>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-4 px-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center py-2.5 rounded-lg border border-slate-600 text-slate-200 font-medium"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-full text-center py-2.5 rounded-lg bg-emerald-600 text-white font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}