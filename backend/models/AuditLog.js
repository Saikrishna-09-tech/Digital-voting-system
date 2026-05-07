import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: [
        'START_ELECTION',
        'END_ELECTION',
        'ADD_CANDIDATE',
        'DELETE_CANDIDATE',
        'VIEW_RESULTS',
        'EXPORT_RESULTS',
        'SYSTEM_ACCESS',
      ],
      required: true,
    },
    details: String,
    ipAddress: String,
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('AuditLog', auditLogSchema);
