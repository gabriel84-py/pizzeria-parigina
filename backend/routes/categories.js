const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/init', async (req, res) => {
  try {
    const count = await Category.countDocuments();
    if (count > 0) {
      return res.status(400).json({ error: 'Catégories déjà initialisées' });
    }
    const categories = [
      { name: 'Base Rouge', order: 1 },
      { name: 'Base Blanche', order: 2 }
    ];
    await Category.insertMany(categories);
    res.json({ message: 'Catégories initialisées' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;