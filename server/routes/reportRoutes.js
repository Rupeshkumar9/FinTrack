import express from 'express';
import {
  getMonthlyReport,
  getCategoryReport,
  exportCSV,
} from '../controllers/reportController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);
router.get('/monthly', getMonthlyReport);
router.get('/category', getCategoryReport);
router.get('/export', exportCSV);

export default router;
