const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ order: 1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const image = new Gallery(req.body);
    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(image);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;