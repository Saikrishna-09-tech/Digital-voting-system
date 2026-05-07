import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['voter', 'admin'],
      default: 'voter',
    },
    voterId: {
      type: String,
      required: function() { return this.role === 'voter'; },
      unique: true,
      sparse: true,
      trim: true,
    },
    aadhaar: {
      type: String,
      required: function() { return this.role === 'voter'; },
      unique: true,
      sparse: true,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otpCode: String,
    otpExpires: Date,
    walletAddress: String,
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
