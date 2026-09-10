import express from 'express';
import { getBudgets, upsertBudget, deleteBudget } from '../controllers/budgetController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);
router.route('/').get(getBudgets).post(upsertBudget);
router.route('/:id').delete(deleteBudget);

export default router;
