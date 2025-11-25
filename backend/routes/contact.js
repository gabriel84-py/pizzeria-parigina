const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');

// Helper pour formater le contact
function formatContact(contact) {
  if (!contact) return null;
  return {
    _id: contact.id.toString(),
    id: contact.id,
    phone: contact.phone,
    email: contact.email,
    address: contact.address,
    mapsLink: contact.mapsLink || '',
    createdAt: contact.created_at,
    updatedAt: contact.updated_at
  };
}

router.get('/', (req, res) => {
  try {
    const contact = Contact.findOne();
    res.json(formatContact(contact));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', authMiddleware, (req, res) => {
  try {
    const contact = Contact.createOrUpdate(req.body);
    res.json(formatContact(contact));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/init', (req, res) => {
  try {
    const count = Contact.count();
    if (count > 0) {
      return res.status(400).json({ error: 'Contact déjà initialisé' });
    }
    const contact = Contact.createOrUpdate({
      phone: '07 68 28 06 28',
      email: 'pariginafg75@gmail.com',
      address: '628 Avenue de Rheinbach, Villeneuve-lès-Avignon, France',
      mapsLink: 'https://maps.google.com/?q=628+Avenue+de+Rheinbach+Villeneuve-lès-Avignon'
    });
    res.json({ message: 'Contact initialisé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
