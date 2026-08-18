import { Router } from 'express';
import {
  getTransactions,
  issueBook,
  returnBook,
  getStats
} from '../controllers/transactionController.js';

const router = Router();

router.get('/', getTransactions);
router.get('/stats', getStats);
router.post('/issue', issueBook);
router.put('/:id/return', returnBook);

export default router;
