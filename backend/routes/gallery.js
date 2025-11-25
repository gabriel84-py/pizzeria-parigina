const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const authMiddleware = require('../middleware/auth');

// Helper pour formater l'image
function formatImage(image) {
  if (!image) return null;
  return {
    _id: image.id.toString(),
    id: image.id,
    imageUrl: image.imageUrl,
    alt: image.alt || 'Pizzeria Parigina',
    order: image.order || 0,
    createdAt: image.created_at,
    updatedAt: image.updated_at
  };
}

router.get('/', (req, res) => {
  try {
    const images = Gallery.findAll();
    res.json(images.map(formatImage));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const image = Gallery.create(req.body);
    res.status(201).json(formatImage(image));
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
    const image = Gallery.update(parseId(req.params.id), req.body);
    if (!image) {
      return res.status(404).json({ error: 'Image non trouvée' });
    }
    res.json(formatImage(image));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const result = Gallery.delete(parseId(req.params.id));
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Image non trouvée' });
    }
    res.json({ message: 'Image supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
