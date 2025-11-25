const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const contact = await Contact.findOne();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact(req.body);
    } else {
      Object.assign(contact, req.body);
    }
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/init', async (req, res) => {
  try {
    const count = await Contact.countDocuments();
    if (count > 0) {
      return res.status(400).json({ error: 'Contact déjà initialisé' });
    }
    const contact = new Contact({
      phone: '07 68 28 06 28',
      email: 'pariginafg75@gmail.com',
      address: '628 Avenue de Rheinbach, Villeneuve-lès-Avignon, France',
      mapsLink: 'https://maps.google.com/?q=628+Avenue+de+Rheinbach+Villeneuve-lès-Avignon'
    });
    await contact.save();
    res.json({ message: 'Contact initialisé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;