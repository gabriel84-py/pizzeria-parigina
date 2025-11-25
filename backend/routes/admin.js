const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth');

// Helper pour formater l'admin
function formatAdmin(admin) {
  if (!admin) return null;
  return {
    _id: admin.id.toString(),
    id: admin.id,
    username: admin.username,
    createdAt: admin.created_at,
    updatedAt: admin.updated_at
  };
}

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = Admin.findByUsername(username);
    if (!admin) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const isMatch = await Admin.comparePassword(admin.password, password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: admin.id },
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
    
    const admin = Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Admin non trouvé' });
    }

    const isMatch = await Admin.comparePassword(admin.password, currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    await Admin.update(admin.id, { password: newPassword });

    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/change-username', authMiddleware, async (req, res) => {
  try {
    const { newUsername } = req.body;
    
    const admin = Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Admin non trouvé' });
    }

    await Admin.update(admin.id, { username: newUsername });

    res.json({ message: 'Nom d\'utilisateur changé avec succès', username: newUsername });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/exists', (req, res) => {
  try {
    const count = Admin.count();
    res.json({ exists: count > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/init', async (req, res) => {
  try {
    const count = Admin.count();
    if (count > 0) {
      return res.status(400).json({ error: 'Admin déjà existant' });
    }

    await Admin.create({
      username: 'parigina',
      password: 'parigina'
    });

    res.json({ message: 'Admin créé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
