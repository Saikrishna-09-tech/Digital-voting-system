import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { electionService } from '../services/api';
import { useAuthStore } from '../context/authStore';
import ElectionTimer from '../components/ElectionTimer';

export default function VoterDashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [electionStatus, setElectionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadElectionStatus();
  }, []);

  const loadElectionStatus = async () => {
    try {
      const res = await electionService.getStatus();
      setElectionStatus(res.data);
    } catch (error) {
      toast.error('Failed to load election status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const statusBadgeColor =
    electionStatus?.status === 'ACTIVE'
      ? 'bg-green-500/20 text-green-400'
      : electionStatus?.status === 'ENDED'
        ? 'bg-red-500/20 text-red-400'
        : 'bg-yellow-500/20 text-yellow-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Voter Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome to secure blockchain voting</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 btn-secondary"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Election Status */}
      {electionStatus && (
        <div className="max-w-6xl mx-auto mb-8 glass p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-2">Election Status</p>
            <div className={`inline-block px-4 py-2 rounded-full font-semibold ${statusBadgeColor}`}>
              {electionStatus.status}
            </div>
          </div>
          {electionStatus.status === 'ACTIVE' && electionStatus.endTime && (
            <ElectionTimer
              endTime={electionStatus.endTime}
              onElectionEnd={() => loadElectionStatus()}
            />
          )}
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Cast Vote Card */}
        <motion.button
          onClick={() => navigate('/voter/cast-vote')}
          disabled={electionStatus?.status !== 'ACTIVE' || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass p-8 rounded-2xl text-center group hover:border-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🗳️</div>
          <h2 className="text-2xl font-bold mb-2">Cast Vote</h2>
          <p className="text-gray-400">Vote for your preferred candidate</p>
          {electionStatus?.status !== 'ACTIVE' && (
            <p className="text-yellow-400 text-sm mt-4">Election not active</p>
          )}
        </motion.button>

        {/* Results Card */}
        <motion.button
          onClick={() => navigate('/results')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass p-8 rounded-2xl text-center group hover:border-indigo-500/50 transition-all"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📊</div>
          <h2 className="text-2xl font-bold mb-2">View Results</h2>
          <p className="text-gray-400">See current live results</p>
        </motion.button>

        {/* Back to System Card */}
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass p-8 rounded-2xl text-center group hover:border-indigo-500/50 transition-all"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏠</div>
          <h2 className="text-2xl font-bold mb-2">Back to Home</h2>
          <p className="text-gray-400">Return to main page</p>
        </motion.button>
      </div>
    </div>
  );
}
