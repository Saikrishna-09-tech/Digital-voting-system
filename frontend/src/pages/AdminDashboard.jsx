import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { electionService } from '../services/api';
import { useAuthStore } from '../context/authStore';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [electionStatus, setElectionStatus] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadElectionStatus();
  }, []);

  const loadElectionStatus = async () => {
    try {
      const res = await electionService.getStatus();
      setElectionStatus(res.data);
    } catch (error) {
      toast.error('Failed to load election status');
    }
  };

  const handleStartElection = async () => {
    setIsLoading(true);
    try {
      await electionService.startElection();
      toast.success('Election started!');
      loadElectionStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start election');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndElection = async () => {
    if (!window.confirm('Are you sure you want to end the election?')) return;
    setIsLoading(true);
    try {
      await electionService.endElection();
      toast.success('Election ended!');
      loadElectionStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to end election');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', onClick: () => {}, icon: '📊' },
    { label: 'Start Election', onClick: handleStartElection, icon: '▶️' },
    { label: 'Stop Election', onClick: handleEndElection, icon: '⏹️' },
    { label: 'Manage Candidates', onClick: () => navigate('/admin/manage-candidates'), icon: '👥' },
    { label: 'View Results', onClick: () => navigate('/results'), icon: '📈' },
    { label: 'Analytics', onClick: () => navigate('/admin/analytics'), icon: '📉' },
  ];

  const statusBadgeColor =
    electionStatus?.status === 'ACTIVE'
      ? 'bg-green-500/20 text-green-400'
      : electionStatus?.status === 'ENDED'
        ? 'bg-red-500/20 text-red-400'
        : 'bg-yellow-500/20 text-yellow-400';

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="w-64 glass border-r border-slate-800 p-6 fixed md:relative h-full overflow-y-auto z-20"
      >
        <h1 className="text-2xl font-bold gradient-text mb-8">Admin Panel</h1>

        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                // keep the sidebar visible on desktop
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              disabled={isLoading && item.label !== 'Dashboard'}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-600/20 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full mt-8 btn-secondary flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Logout
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="glass border-b border-slate-800 p-6 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>
          <h2 className="text-3xl font-bold gradient-text">Admin Dashboard</h2>
          <div className={`px-4 py-2 rounded-full font-semibold ${statusBadgeColor}`}>
            {electionStatus?.status}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {/* Stats Card */}
              <div className="glass p-6 rounded-2xl">
                <p className="text-gray-400 text-sm mb-2">Total Voters</p>
                <h3 className="text-3xl font-bold gradient-text">
                  {electionStatus?.totalVoters || 0}
                </h3>
              </div>

              <div className="glass p-6 rounded-2xl">
                <p className="text-gray-400 text-sm mb-2">Votes Cast</p>
                <h3 className="text-3xl font-bold gradient-text">
                  {electionStatus?.votesCast || 0}
                </h3>
              </div>

              <div className="glass p-6 rounded-2xl">
                <p className="text-gray-400 text-sm mb-2">Participation Rate</p>
                <h3 className="text-3xl font-bold gradient-text">
                  {electionStatus?.totalVoters
                    ? Math.round(
                        (
                          (electionStatus?.votesCast / electionStatus?.totalVoters) *
                          100
                        ).toFixed(2)
                      )
                    : 0}
                  %
                </h3>
              </div>
            </motion.div>

            {/* Welcome message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-8 rounded-2xl mt-6 text-center"
            >
              <h3 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h3>
              <p className="text-gray-400">
                Use the sidebar to manage candidates, control election status, and view analytics.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
