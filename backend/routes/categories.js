const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');

// Helper pour formater la catégorie
function formatCategory(category) {
  if (!category) return null;
  return {
    _id: category.id.toString(),
    id: category.id,
    name: category.name,
    order: category.order || 0,
    createdAt: category.created_at,
    updatedAt: category.updated_at
  };
}

router.get('/', (req, res) => {
  try {
    const categories = Category.findAll();
    res.json(categories.map(formatCategory));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const category = Category.create(req.body);
    res.status(201).json(formatCategory(category));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Helper pour convertir l'ID
function parseId(id) {
  return typeof id === 'string' ? parseInt(id) : id;
}

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const category = Category.update(parseId(req.params.id), req.body);
    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    res.json(formatCategory(category));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const result = Category.delete(parseId(req.params.id));
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    res.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/init', (req, res) => {
  try {
    const count = Category.count();
    if (count > 0) {
      return res.status(400).json({ error: 'Catégories déjà initialisées' });
    }
    const categories = [
      { name: 'Base Rouge', order: 1 },
      { name: 'Base Blanche', order: 2 }
    ];
    categories.forEach(cat => Category.create(cat));
    res.json({ message: 'Catégories initialisées' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
