const express = require('express');
const router = express.Router();
const Hours = require('../models/Hours');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const hours = await Hours.find().sort({ order: 1 });
    res.json(hours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const hour = await Hours.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(hour);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/init', async (req, res) => {
  try {
    const count = await Hours.countDocuments();
    if (count > 0) {
      return res.status(400).json({ error: 'Horaires déjà initialisés' });
    }
    const hours = [
      { day: 'Lundi', closed: true, order: 1 },
      { day: 'Mardi', open: '18h00', close: '21h00', closed: false, order: 2 },
      { day: 'Mercredi', open: '18h00', close: '21h00', closed: false, order: 3 },
      { day: 'Jeudi', open: '18h00', close: '21h00', closed: false, order: 4 },
      { day: 'Vendredi', open: '18h00', close: '21h30', closed: false, order: 5 },
      { day: 'Samedi', open: '18h00', close: '21h30', closed: false, order: 6 },
      { day: 'Dimanche', closed: true, order: 7 }
    ];
    await Hours.insertMany(hours);
    res.json({ message: 'Horaires initialisés' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;