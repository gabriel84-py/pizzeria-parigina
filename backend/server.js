const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Initialiser la base de données SQLite
require('./database');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes API
app.use('/api/pizzas', require('./routes/pizzas'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/hours', require('./routes/hours'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/admin', require('./routes/admin'));

// Route de santé
app.get('/api/health', (req, res) => {
  const db = require('./database');
  let dbStatus = 'connected';
  try {
    // Tester la connexion
    db.prepare('SELECT 1').get();
  } catch (error) {
    dbStatus = 'error';
  }
  
  res.json({ 
    status: 'OK', 
    message: 'API Pizzeria Parigina opérationnelle',
    database: {
      status: dbStatus,
      connected: dbStatus === 'connected',
      type: 'SQLite',
      path: 'backend/data/app.db'
    },
    timestamp: new Date().toISOString()
  });
});

// Route catch-all pour servir index.html (pour le routing côté client)
app.get('*', (req, res) => {
  // Ne pas intercepter les routes API
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Route API non trouvée' });
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🍕 Serveur démarré sur le port ' + PORT);
  console.log('🌐 Site accessible sur http://localhost:' + PORT);
  console.log('💾 Base de données SQLite : backend/data/app.db');
});
