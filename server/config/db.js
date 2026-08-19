import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);

  console.log('MongoDB connected successfully');
}
