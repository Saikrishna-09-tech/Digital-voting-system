import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { voteService } from '../services/api';

export default function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [totalVoters, setTotalVoters] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    loadResults();
    const interval = setInterval(loadResults, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadResults = async () => {
    try {
      const res = await voteService.getResults();
      const data = res.data.results || [];
      const total = res.data.totalVotes || 0;

      const sorted = [...data].sort((a, b) => b.voteCount - a.voteCount);
      setResults(sorted);
      setTotalVoters(total);

      if (sorted.length > 0) {
        setWinner(sorted[0]);
      }
    } catch (error) {
      console.error('Failed to load results:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-4xl font-bold gradient-text mb-2">Election Results</h1>
        <p className="text-gray-400 mb-8">Total Votes: {totalVoters}</p>

        {/* Winner Card */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-2xl mb-8 border-2 border-yellow-400/30 gradient-border"
          >
            <div className="flex items-center gap-4 mb-4">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-bold">Leading Candidate</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <img
                  src={winner.image}
                  alt={winner.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="md:col-span-3">
                <h3 className="text-3xl font-bold mb-2">{winner.name}</h3>
                <p className="text-gray-400 mb-4 text-lg">{winner.party}</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Total Votes</p>
                    <p className="text-4xl font-bold gradient-text">{winner.voteCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Vote Percentage</p>
                    <p className="text-4xl font-bold gradient-text">
                      {totalVoters > 0 ? ((winner.voteCount / totalVoters) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chart */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-2xl mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Vote Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid #64748b',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="voteCount" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-8 rounded-2xl"
        >
          <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
          <div className="space-y-4">
            {results.map((candidate, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg flex items-center justify-between ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-transparent' : 'bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl font-bold text-gray-500 w-8">#{index + 1}</div>
                  {candidate.image && (
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{candidate.name}</h3>
                    <p className="text-gray-400 text-sm">{candidate.party}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold gradient-text">{candidate.voteCount}</p>
                  <p className="text-gray-400 text-sm">
                    {totalVoters > 0 ? ((candidate.voteCount / totalVoters) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
