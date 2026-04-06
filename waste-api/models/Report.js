import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // Store the image as base64 or URL
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Report', ReportSchema);