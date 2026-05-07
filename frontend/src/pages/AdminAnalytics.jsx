import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { electionService, auditService } from '../services/api';

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const analyticsRes = await electionService.getAnalytics();
      setAnalytics(analyticsRes.data);

      const auditRes = await auditService.getAuditLog(1, 20);
      setAuditLog(auditRes.data.logs);
    } catch (error) {
      console.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
      </div>
    );
  }

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-4xl font-bold gradient-text mb-8">Analytics Dashboard</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl text-center"
          >
            <p className="text-gray-400 text-sm mb-2">Total Voters</p>
            <h3 className="text-3xl font-bold gradient-text">{analytics?.totalVoters || 0}</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-2xl text-center"
          >
            <p className="text-gray-400 text-sm mb-2">Votes Cast</p>
            <h3 className="text-3xl font-bold gradient-text">{analytics?.totalVotesCast || 0}</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-2xl text-center"
          >
            <p className="text-gray-400 text-sm mb-2">Participation</p>
            <h3 className="text-3xl font-bold gradient-text">
              {analytics?.participationRate || 0}%
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-2xl text-center"
          >
            <p className="text-gray-400 text-sm mb-2">Pending Votes</p>
            <h3 className="text-3xl font-bold gradient-text">
              {(analytics?.totalVoters || 0) - (analytics?.totalVotesCast || 0)}
            </h3>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Vote Distribution Pie Chart */}
          {analytics?.candidateVotes && analytics.candidateVotes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Vote Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.candidateVotes}
                    dataKey="votes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {analytics.candidateVotes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Vote Trend Line Chart */}
          {analytics?.voteTrend && analytics.voteTrend.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-6 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Vote Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.voteTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #64748b' }} />
                  <Line type="monotone" dataKey="votes" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>

        {/* Audit Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-2xl"
        >
          <h2 className="text-2xl font-bold mb-6">Audit Log</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLog.length > 0 ? (
              auditLog.map((log, index) => (
                <div key={index} className="p-3 bg-slate-800/50 rounded-lg text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-indigo-400">{log.action}</span>
                    <span className="text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  {log.details && <p className="text-gray-400">{log.details}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No audit logs yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
