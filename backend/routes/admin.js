const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || 'secret_key_default',
      { expiresIn: '24h' }
    );

    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await Admin.findById(req.adminId);
    const isMatch = await admin.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/change-username', authMiddleware, async (req, res) => {
  try {
    const { newUsername } = req.body;
    
    const admin = await Admin.findById(req.adminId);
    admin.username = newUsername;
    await admin.save();

    res.json({ message: 'Nom d\'utilisateur changé avec succès', username: newUsername });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/exists', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    res.json({ exists: count > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/init', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) {
      return res.status(400).json({ error: 'Admin déjà existant' });
    }

    const admin = new Admin({
      username: 'parigina',
      password: 'parigina'
    });
    await admin.save();

    res.json({ message: 'Admin créé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;