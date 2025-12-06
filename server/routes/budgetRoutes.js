import express from 'express';
import {
  getBudget,
  createOrUpdateBudget,
  deleteBudget,
  getAllBudgets
} from '../controllers/budgetController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getBudget)
  .post(protect, createOrUpdateBudget);

router.get('/all', protect, getAllBudgets);
router.delete('/:id', protect, deleteBudget);

export default router;