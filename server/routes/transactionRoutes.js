import express from 'express';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} from '../controllers/transactionController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);
router.get('/summary', getSummary);
router.route('/').get(getTransactions).post(createTransaction);
router.route('/:id').put(updateTransaction).delete(deleteTransaction);

export default router;
