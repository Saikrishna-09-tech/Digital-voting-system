import Election from '../models/Election.js';
import Vote from '../models/Vote.js';
import Candidate from '../models/Candidate.js';
import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';

export const getStatus = async (req, res) => {
  try {
    let election = await Election.findOne();

    if (!election) {
      election = new Election();
      await election.save();
    }

    const totalVotes = await Vote.countDocuments();
    const totalVoters = await User.countDocuments({ role: 'voter', isEmailVerified: true });

    res.json({
      status: election.status,
      startTime: election.startTime,
      endTime: election.endTime,
      totalVoters,
      votesCast: totalVotes,
      totalCandidates: await Candidate.countDocuments({ isDeleted: false }),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch election status', error: error.message });
  }
};

export const startElection = async (req, res) => {
  try {
    const adminId = req.user.userId;

    let election = await Election.findOne();
    if (!election) {
      election = new Election();
    }

    if (election.status === 'ACTIVE') {
      return res.status(400).json({ message: 'Election already active' });
    }

    if (election.status === 'ENDED') {
      // Allow restart after end (optional behavior)
      election.startTime = new Date();
      election.endTime = null;
      election.totalVotesCast = 0;
      // Clear any stray votes (ensure clean slate)
      await Vote.deleteMany({});
    }

    election.status = 'ACTIVE';
    election.blockchainStatus = 'ACTIVE';
    if (!election.startTime) election.startTime = new Date();
    await election.save();

    // Log audit action
    await AuditLog.create({
      admin: adminId,
      action: 'START_ELECTION',
      details: 'Election started',
    });

    res.json({ message: 'Election started successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start election', error: error.message });
  }
};

export const endElection = async (req, res) => {
  try {
    const adminId = req.user.userId;

    const election = await Election.findOne();

    if (!election || election.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Election not active' });
    }

    election.status = 'ENDED';
    election.blockchainStatus = 'ENDED';
    election.endTime = new Date();
    await election.save();

    // Do not clear votes yet; keep results available until a new election starts.

    // Log audit action
    await AuditLog.create({
      admin: adminId,
      action: 'END_ELECTION',
      details: 'Election ended (results preserved until next start)',
    });

    res.json({ message: 'Election ended successfully, results preserved' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to end election', error: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const election = await Election.findOne();
    const votes = await Vote.countDocuments();
    const candidates = await Candidate.find({ isDeleted: false });

    const candidateVotes = await Vote.aggregate([
      {
        $group: {
          _id: '$candidate',
          votes: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'candidates',
          localField: '_id',
          foreignField: '_id',
          as: 'info',
        },
      },
      { $unwind: '$info' },
      {
        $project: {
          name: '$info.name',
          votes: 1,
        },
      },
    ]);

    const totalVoters = await User.countDocuments({ role: 'voter', isEmailVerified: true });

    res.json({
      totalVoters,
      totalVotesCast: votes,
      participationRate: totalVoters > 0 ? ((votes / totalVoters) * 100).toFixed(2) : 0,
      candidateVotes,
      voteTrend: [], // Would need to implement time-based tracking
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};
