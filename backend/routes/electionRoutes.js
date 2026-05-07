import express from 'express';
import { getStatus, startElection, endElection, getAnalytics } from '../controllers/electionController.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.get('/status', getStatus);
router.post('/start', authMiddleware, roleMiddleware(['admin']), startElection);
router.post('/end', authMiddleware, roleMiddleware(['admin']), endElection);
router.get('/analytics', authMiddleware, roleMiddleware(['admin']), getAnalytics);

export default router;
