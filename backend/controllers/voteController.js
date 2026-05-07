import Vote from '../models/Vote.js';
import Candidate from '../models/Candidate.js';
import User from '../models/User.js';

export const castVote = async (req, res) => {
  try {
    const { candidateId, txHash } = req.body;
    const userId = req.user.userId;

    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get user and check if OTP verified
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'voter' && !user.isEmailVerified) {
      return res.status(403).json({ message: 'Please verify your email with OTP first' });
    }

    // Check if voter already voted
    const existingVote = await Vote.findOne({ voter: userId });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    // Check candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Validate transaction hash
    if (!txHash) {
      return res.status(400).json({ message: 'Transaction hash required' });
    }

    // Record vote
    const vote = new Vote({
      voter: userId,
      candidate: candidateId,
      transactionHash: txHash,
      walletAddress: user.walletAddress,
    });

    await vote.save();

    res.status(201).json({ message: 'Vote recorded successfully', vote });
  } catch (error) {
    console.error('❌ castVote Error:', error);
    res.status(500).json({ message: 'Failed to cast vote', error: error.message });
  }
};

export const hasUserVoted = async (req, res) => {
  try {
    const userId = req.user.userId;

    const vote = await Vote.findOne({ voter: userId });
    res.json({ hasVoted: !!vote });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check vote status', error: error.message });
  }
};

export const getResults = async (req, res) => {
  try {
    const votes = await Vote.aggregate([
      {
        $group: {
          _id: '$candidate',
          voteCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'candidates',
          localField: '_id',
          foreignField: '_id',
          as: 'candidateInfo',
        },
      },
      { $unwind: '$candidateInfo' },
      {
        $project: {
          _id: 0,
          candidateId: '$_id',
          name: '$candidateInfo.name',
          party: '$candidateInfo.party',
          image: '$candidateInfo.image',
          voteCount: 1,
        },
      },
      { $sort: { voteCount: -1 } },
    ]);

    const totalVotes = await Vote.countDocuments();

    res.json({ results: votes, totalVotes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch results', error: error.message });
  }
};

export const getTotalVoters = async (req, res) => {
  try {
    const totalVoters = await User.countDocuments({ role: 'voter', isEmailVerified: true });
    const totalVOtes = await Vote.countDocuments();

    res.json({ totalVoters, totalVotes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};
