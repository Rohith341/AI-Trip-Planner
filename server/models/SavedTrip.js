import mongoose from 'mongoose';

const SavedTripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: String,
  startDate: String,
  numberOfDays: Number,
  travelerType: String,
  budget: String,
  travelers: Number,
}, { timestamps: true });

export default mongoose.model('SavedTrip', SavedTripSchema);
