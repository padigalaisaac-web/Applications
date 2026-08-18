import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    author: { type: String, required: [true, 'Author is required'], trim: true },
    category: { type: String, trim: true, default: 'General' },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
      default: 1
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: [0, 'Available quantity cannot be negative'],
      default: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);
