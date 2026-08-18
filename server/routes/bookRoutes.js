import { Router } from 'express';
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';

const router = Router();

router.route('/').get(getBooks).post(createBook);
router.route('/:id').get(getBook).put(updateBook).delete(deleteBook);

export default router;
