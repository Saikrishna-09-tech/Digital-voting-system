import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { candidateService, voteService } from '../services/api';
import { blockchainService } from '../blockchain/blockchainService';
import { useAuthStore, useElectionStore } from '../context/authStore';

export default function CastVote() {
  const navigate = useNavigate();
  const userEmail = useAuthStore((state) => state.userEmail);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const setHasVotedStore = useElectionStore((state) => state.setHasVoted);

  useEffect(() => {
    loadCandidatesAndCheckVote();
  }, []);

  const loadCandidatesAndCheckVote = async () => {
    try {
      // Load candidates
      const res = await candidateService.getAllCandidates();
      setCandidates(res.data.candidates);

      // Check if user already voted
      const votedRes = await voteService.hasUserVoted();
      setHasVoted(votedRes.data.hasVoted);
    } catch (error) {
      toast.error('Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    setIsVoting(true);
    try {
      // Connect wallet first
      await blockchainService.connectWallet();

      // Cast vote on blockchain
      const receipt = await blockchainService.castVote(selectedCandidate.id);
      const hash = receipt.hash;
      setTxHash(hash);

      // Record vote in database
      await voteService.castVote(selectedCandidate.id, hash);
      setHasVotedStore(true);
      toast.success('Vote cast successfully!');

      // Show success modal for 3 seconds
      setTimeout(() => {
        navigate('/voter/dashboard');
      }, 3000);
    } catch (error) {
      if (error.message.includes('already voted')) {
        toast.error('You have already voted');
        setHasVoted(true);
      } else {
        toast.error(error.message || 'Failed to cast vote');
      }
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-8 rounded-2xl text-center max-w-md"
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-2 gradient-text">Vote Already Cast</h2>
          <p className="text-gray-400 mb-6">You have already voted in this election</p>
          <button
            onClick={() => navigate('/voter/dashboard')}
            className="w-full btn-primary"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/voter/dashboard')}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-4xl font-bold gradient-text mb-8">Cast Your Vote</h1>

        {/* Candidates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {candidates.map((candidate, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCandidate(candidate)}
              className={`glass p-6 rounded-2xl cursor-pointer transition-all ${
                selectedCandidate?.id === candidate.id
                  ? 'ring-2 ring-indigo-400 scale-105'
                  : 'hover:scale-105'
              }`}
            >
              <img
                src={candidate.image}
                alt={candidate.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{candidate.name}</h3>
              <p className="text-gray-400 mb-4">{candidate.party}</p>
              {selectedCandidate?.id === candidate.id && (
                <div className="text-indigo-400 font-semibold">✓ Selected</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Vote Button */}
        <motion.button
          onClick={handleVote}
          disabled={!selectedCandidate || isVoting}
          className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isVoting && <Loader2 className="w-5 h-5 animate-spin" />}
          {isVoting ? 'Processing Vote...' : 'Confirm Vote'}
        </motion.button>
      </div>

      {/* Success Modal */}
      {txHash && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 px-4 z-50"
        >
          <div className="glass p-8 rounded-2xl max-w-md text-center">
            <div className="text-6xl mb-4 animate-pulse">🎉</div>
            <h2 className="text-3xl font-bold mb-4 gradient-text">Vote Successful!</h2>
            <p className="text-gray-400 mb-4">Your vote has been recorded on the blockchain</p>
            <p className="text-sm text-gray-500 break-all bg-slate-800 p-4 rounded-lg font-mono">
              TX: {txHash?.substring(0, 20)}...
            </p>
            <p className="text-gray-400 mt-4">Redirecting to dashboard...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
