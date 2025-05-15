import express from 'express';
import Trip from '../models/Trip.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId || decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// PUT /api/trips/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updatedTrip) return res.status(404).json({ message: 'Trip not found' });
    res.json(updatedTrip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update trip', details: err.message });
  }
});

// GET /api/trips/user/all
router.get('/user/all', verifyToken, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips', details: err.message });
  }
});

// POST /api/trips/generate

router.post('/generate', (req, res) => {
    const { destination, startDate, numberOfDays, travelerType, budget, travelers } = req.body;
  
    // Dummy AI-generated plan logic
    const plan = Array.from({ length: numberOfDays }, (_, index) => ({
      title: `Day ${index + 1}: Adventure in ${destination}`,
      placeImage: `https://source.unsplash.com/800x400/?${destination},travel&sig=${index}`,
      description: `Explore top spots in ${destination} with ${travelerType} traveler vibe.`,
      stay: budget === 'low' ? 'Hostel Stay' : budget === 'moderate' ? '3-star Hotel' : 'Luxury Resort',
      transport: travelers > 2 ? 'Private Van' : 'Taxi/Metro',
      food: budget === 'low' ? 'Local Street Food' : 'Local Restaurants',
    }));
  
    const generatedTrip = {
      destination,
      startDate,
      numberOfDays,
      travelerType,
      budget,
      travelers,
      summary: `Here's your personalized ${numberOfDays}-day trip to ${destination} for a ${travelerType} traveler!`,
      plan,
    };
  
    res.status(200).json(generatedTrip);
  });
  

// POST /api/trips
router.post('/', verifyToken, async (req, res) => {
  try {
    const { destination, startDate, numberOfDays, travelerType, budget, travelers } = req.body;

    if (!destination || !startDate || !numberOfDays || !travelerType || !budget || !travelers) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newTrip = new Trip({ ...req.body, userId: req.userId });
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save trip', details: err.message });
  }
});

export default router;
