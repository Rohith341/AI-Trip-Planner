import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  destination: String,
  startDate: String,
  numberOfDays: Number,
  travelerType: String,
  budget: String,
  travelers: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Trip', tripSchema);
