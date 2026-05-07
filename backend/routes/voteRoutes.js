import express from 'express';
import { castVote, hasUserVoted, getResults, getTotalVoters } from '../controllers/voteController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/cast', authMiddleware, castVote);
router.get('/has-voted', authMiddleware, hasUserVoted);
router.get('/results', getResults);
router.get('/total-voters', getTotalVoters);

export default router;
