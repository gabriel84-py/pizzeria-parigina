const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  alt: { type: String, default: 'Pizzeria Parigina' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);