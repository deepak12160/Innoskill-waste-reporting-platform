import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

// Create a new report
router.post('/', async (req, res) => {
  try {
    const locationPayload = typeof req.body.location === 'string'
      ? JSON.parse(req.body.location)
      : req.body.location;

    const newReport = await Report.create({
      title: req.body.title,
      imageUrl: req.body.imageUrl || 'https://via.placeholder.com/150',
      location: locationPayload
    });

    if (req.io) {
      req.io.emit('new-report', newReport);
    }

    res.status(201).json(newReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to save report. Check request payload.' });
  }
});

// Get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to read reports.' });
  }
});

export default router;