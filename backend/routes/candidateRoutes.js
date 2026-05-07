import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getAllCandidates, addCandidate, updateCandidate, deleteCandidate, uploadImage } from '../controllers/candidateController.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';

const router = express.Router();

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      cb(null, safeName);
    },
  }),
});

router.get('/', getAllCandidates);
router.post('/upload', authMiddleware, roleMiddleware(['admin']), upload.single('image'), uploadImage);
router.post('/', authMiddleware, roleMiddleware(['admin']), addCandidate);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateCandidate);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteCandidate);

export default router;
