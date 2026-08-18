import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Book from './models/Book.js';
import Member from './models/Member.js';
import Transaction from './models/Transaction.js';

dotenv.config();

const books = [
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', isbn: '9780132350884', quantity: 4 },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Programming', isbn: '9780201616224', quantity: 3 },
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', isbn: '9780262033848', quantity: 2 },
  { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', isbn: '9780062316097', quantity: 5 },
  { title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', isbn: '9780061122415', quantity: 1 }
];

const members = [
  { name: 'Asha Rao', email: 'asha.rao@example.com', phone: '9876543210' },
  { name: 'Vikram Singh', email: 'vikram.singh@example.com', phone: '9812345678' },
  { name: 'Meera Nair', email: 'meera.nair@example.com', phone: '9900112233' }
];

async function seed() {
  await connectDB(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_management');
  await Promise.all([
    Book.deleteMany({}),
    Member.deleteMany({}),
    Transaction.deleteMany({})
  ]);

  const createdBooks = await Book.insertMany(
    books.map((b) => ({ ...b, availableQuantity: b.quantity }))
  );
  const createdMembers = await Member.insertMany(members);

  const book = createdBooks[0];
  book.availableQuantity -= 1;
  await book.save();
  await Transaction.create({ bookId: book._id, memberId: createdMembers[0]._id });

  console.log(`Seeded ${createdBooks.length} books and ${createdMembers.length} members`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
