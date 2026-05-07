import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['NOT_STARTED', 'ACTIVE', 'ENDED'],
      default: 'NOT_STARTED',
    },
    startTime: Date,
    endTime: Date,
    totalVoters: {
      type: Number,
      default: 0,
    },
    totalVotesCast: {
      type: Number,
      default: 0,
    },
    blockchainStatus: {
      type: String,
      enum: ['NOT_STARTED', 'ACTIVE', 'ENDED'],
      default: 'NOT_STARTED',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Election', electionSchema);
