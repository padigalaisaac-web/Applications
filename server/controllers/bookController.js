import Book from '../models/Book.js';
import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getBooks = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = search
    ? {
        $or: [
          { title: new RegExp(search, 'i') },
          { author: new RegExp(search, 'i') },
          { isbn: new RegExp(search, 'i') },
          { category: new RegExp(search, 'i') }
        ]
      }
    : {};
  const books = await Book.find(filter).sort({ createdAt: -1 });
  res.json(books);
});

export const getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

export const createBook = asyncHandler(async (req, res) => {
  const { title, author, category, isbn, quantity } = req.body;
  const qty = Number(quantity ?? 1);
  const book = await Book.create({
    title,
    author,
    category,
    isbn,
    quantity: qty,
    availableQuantity: qty
  });
  res.status(201).json(book);
});

export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const { title, author, category, isbn, quantity } = req.body;
  const issuedCount = book.quantity - book.availableQuantity;

  if (quantity !== undefined) {
    const newQty = Number(quantity);
    if (Number.isNaN(newQty) || newQty < 0) {
      return res.status(400).json({ message: 'Quantity must be a non-negative number' });
    }
    if (newQty < issuedCount) {
      return res.status(400).json({
        message: `Quantity cannot be less than the ${issuedCount} copies currently issued`
      });
    }
    book.quantity = newQty;
    book.availableQuantity = newQty - issuedCount;
  }

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (category !== undefined) book.category = category;
  if (isbn !== undefined) book.isbn = isbn;

  await book.save();
  res.json(book);
});

export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const activeIssues = await Transaction.countDocuments({
    bookId: book._id,
    status: 'issued'
  });
  if (activeIssues > 0) {
    return res
      .status(400)
      .json({ message: 'Cannot delete a book that is currently issued' });
  }

  await book.deleteOne();
  res.json({ message: 'Book deleted' });
});
