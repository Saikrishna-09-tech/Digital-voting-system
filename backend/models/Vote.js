import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    transactionHash: {
      type: String,
      required: true,
      unique: true,
    },
    walletAddress: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    blockchainConfirmed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure one vote per voter
voteSchema.index({ voter: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);
