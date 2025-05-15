import express from 'express';
import SavedTrip from '../models/SavedTrip.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId || decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Save a trip
router.post('/', verifyToken, async (req, res) => {
  try {
    const savedTrip = new SavedTrip({ ...req.body, userId: req.userId });
    await savedTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(500).json({ message: 'Error saving trip', error: err.message });
  }
});

// Get all saved trips
router.get('/', verifyToken, async (req, res) => {
  try {
    const trips = await SavedTrip.find({ userId: req.userId });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching saved trips' });
  }
});

export default router;
