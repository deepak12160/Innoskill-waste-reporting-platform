import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

// 1. POST: Save a new report from your UI
router.post('/', async (req, res) => {
  try {
    const { location, description, image } = req.body;

    const newReport = new Report({
      location,
      description,
      image,
      status: 'Pending' // Matches the Red 'Pending' button in your UI
    });

    const savedReport = await newReport.save();

    // This triggers the real-time update for your "View Reports" list
    if (req.io) {
      req.io.emit('newReport', savedReport);
    }

    res.status(201).json(savedReport);
  } catch (err) {
    console.error("❌ Error saving report:", err);
    res.status(400).json({ message: "Failed to save report", error: err.message });
  }
});

// 2. GET: Fetch all reports for the right-side list in your UI
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// 3. PATCH: Update status (to change Red 'Pending' to Green 'Resolved')
router.patch('/:id', async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

export default router;