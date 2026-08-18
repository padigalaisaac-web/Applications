import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, 'Invalid phone number']
    },
    membershipDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Member', memberSchema);
