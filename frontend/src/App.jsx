import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- Components ---
import Navbar from './components/Navbar';

// --- Pages ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NGOList from './pages/NGOList';
import NGODetail from './pages/NGODetail';
import Chat from './pages/Chat';
import Feed from './pages/Feed';

// --- NGO Management Pages ---
import RegisterNGO from './pages/RegisterNGO';
import ManageOpportunities from './pages/ManageOpportunities';
import ManageApplications from './pages/ManageApplications';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        {/* The pt-24 pushes the content safely below your floating Navbar */}
        <main className="min-h-screen bg-slate-950 text-slate-200 pt-24 flex flex-col">



          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ngos" element={<NGOList />} />
            <Route path="/ngos/:id" element={<NGODetail />} />
            <Route path="/feed" element={<Feed />} />

            {/* Protected/User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />

            {/* NGO Management Routes */}
            <Route path="/register-ngo" element={<RegisterNGO />} />
            <Route path="/ngo/opportunities" element={<ManageOpportunities />} />
            <Route path="/ngo/applications" element={<ManageApplications />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}