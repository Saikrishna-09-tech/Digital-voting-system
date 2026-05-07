import AuditLog from '../models/AuditLog.js';

export const getAuditLog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find()
      .populate('admin', 'email fullName')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments();

    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch audit log', error: error.message });
  }
};

export const logAction = async (req, res) => {
  try {
    const { action, details } = req.body;
    const adminId = req.user.userId;

    const log = new AuditLog({
      admin: adminId,
      action,
      details,
      ipAddress: req.ip,
    });

    await log.save();

    res.status(201).json({ message: 'Action logged', log });
  } catch (error) {
    res.status(500).json({ message: 'Failed to log action', error: error.message });
  }
};
