import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: String,
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Report', ReportSchema);