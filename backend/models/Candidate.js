import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    party: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    blockchainId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Candidate', candidateSchema);
