import express from 'express';
import {
  generateAnalysis,
  getAnalysisHistory,
  getAnalysis
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/analyze', protect, generateAnalysis);
router.get('/history', protect, getAnalysisHistory);
router.get('/analysis', protect, getAnalysis);

export default router;