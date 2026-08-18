import Transaction from '../models/Transaction.js';
import Book from '../models/Book.js';
import Member from '../models/Member.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getTransactions = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const transactions = await Transaction.find(filter)
    .populate('bookId', 'title author isbn')
    .populate('memberId', 'name email')
    .sort({ createdAt: -1 });
  res.json(transactions);
});

export const issueBook = asyncHandler(async (req, res) => {
  const { bookId, memberId } = req.body;
  if (!bookId || !memberId) {
    return res.status(400).json({ message: 'bookId and memberId are required' });
  }

  const [book, member] = await Promise.all([
    Book.findById(bookId),
    Member.findById(memberId)
  ]);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!member) return res.status(404).json({ message: 'Member not found' });
  if (book.availableQuantity < 1) {
    return res.status(400).json({ message: 'No copies available for this book' });
  }

  book.availableQuantity -= 1;
  await book.save();

  const transaction = await Transaction.create({ bookId, memberId });
  const populated = await transaction.populate([
    { path: 'bookId', select: 'title author isbn' },
    { path: 'memberId', select: 'name email' }
  ]);
  res.status(201).json(populated);
});

export const returnBook = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  if (transaction.status === 'returned') {
    return res.status(400).json({ message: 'Book already returned' });
  }

  transaction.status = 'returned';
  transaction.returnDate = new Date();
  await transaction.save();

  const book = await Book.findById(transaction.bookId);
  if (book) {
    book.availableQuantity = Math.min(book.quantity, book.availableQuantity + 1);
    await book.save();
  }

  const populated = await transaction.populate([
    { path: 'bookId', select: 'title author isbn' },
    { path: 'memberId', select: 'name email' }
  ]);
  res.json(populated);
});

export const getStats = asyncHandler(async (req, res) => {
  const [totalBooks, totalCopies, totalMembers, issuedBooks, returnedBooks] =
    await Promise.all([
      Book.countDocuments(),
      Book.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]),
      Member.countDocuments(),
      Transaction.countDocuments({ status: 'issued' }),
      Transaction.countDocuments({ status: 'returned' })
    ]);

  res.json({
    totalBooks,
    totalCopies: totalCopies[0]?.total || 0,
    totalMembers,
    issuedBooks,
    returnedBooks
  });
});
