const express = require('express');
const router = express.Router();
const Hours = require('../models/Hours');
const authMiddleware = require('../middleware/auth');

// Helper pour formater les horaires
function formatHour(hour) {
  if (!hour) return null;
  return {
    _id: hour.id.toString(),
    id: hour.id,
    day: hour.day,
    open: hour.open || '',
    close: hour.close || '',
    closed: hour.closed === 1,
    order: hour.order,
    createdAt: hour.created_at,
    updatedAt: hour.updated_at
  };
}

// Helper pour convertir l'ID (peut être string ou number)
function parseId(id) {
  return typeof id === 'string' ? parseInt(id) : id;
}

router.get('/', (req, res) => {
  try {
    const hours = Hours.findAll();
    res.json(hours.map(formatHour));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const hour = Hours.update(parseId(req.params.id), req.body);
    if (!hour) {
      return res.status(404).json({ error: 'Horaire non trouvé' });
    }
    res.json(formatHour(hour));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/init', (req, res) => {
  try {
    const count = Hours.count();
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
    hours.forEach(hour => Hours.create(hour));
    res.json({ message: 'Horaires initialisés' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
