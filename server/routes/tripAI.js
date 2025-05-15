// routes/tripAI.js
import express from 'express';
const router = express.Router();

// Dummy AI trip generation logic
router.post('/generate', (req, res) => {
  const { destination, numberOfDays, travelerType, budget, travelers } = req.body;

  const sampleTrip = {
    destination,
    summary: `A delightful ${numberOfDays}-day trip to ${destination} for a ${travelerType} with a ${budget} budget.`,
    plan: [],
  };

  const samplePlaces = [
    {
      name: "Central Park",
      description: "A peaceful green space in the middle of the city, perfect for relaxation.",
      image: "https://source.unsplash.com/600x400/?central-park"
    },
    {
      name: "Local Market",
      description: "Experience local culture, food, and shopping.",
      image: "https://source.unsplash.com/600x400/?local-market"
    },
    {
      name: "Museum",
      description: "Learn about the history and art of the region.",
      image: "https://source.unsplash.com/600x400/?museum"
    }
  ];

  for (let i = 1; i <= numberOfDays; i++) {
    const place = samplePlaces[i % samplePlaces.length];
    sampleTrip.plan.push({
      day: i,
      title: `Day ${i}: Explore ${place.name}`,
      description: place.description,
      placeImage: place.image,
      stay: "3-star hotel in city center",
      transport: "Local taxi or walking",
      food: "Try local cuisine at nearby restaurants"
    });
  }

  res.json(sampleTrip);
});

export default router;
