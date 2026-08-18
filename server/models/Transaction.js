import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    issueDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null },
    status: { type: String, enum: ['issued', 'returned'], default: 'issued' }
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
