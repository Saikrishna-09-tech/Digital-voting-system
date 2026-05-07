import express from 'express';
import { getAuditLog, logAction } from '../controllers/auditController.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['admin']), getAuditLog);
router.post('/', authMiddleware, logAction);

export default router;
