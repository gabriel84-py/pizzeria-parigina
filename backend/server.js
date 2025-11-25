const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Connexion MongoDB avec gestion d'erreur améliorée
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzeria_parigina';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connecté');
  console.log('📊 Base de données:', mongoose.connection.name);
})
.catch(err => {
  console.error('❌ Erreur MongoDB:', err.message);
  console.error('💡 Vérifiez votre MONGODB_URI dans le fichier .env');
  // Le serveur continue de démarrer même si MongoDB échoue
  // pour permettre de voir les erreurs dans les logs
});

// Gestion des événements de connexion
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB déconnecté');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnecté');
});

app.use('/api/pizzas', require('./routes/pizzas'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/hours', require('./routes/hours'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({ 
    status: 'OK', 
    message: 'API Pizzeria Parigina opérationnelle',
    database: {
      status: dbStates[dbStatus] || 'unknown',
      connected: dbStatus === 1,
      name: mongoose.connection.name || 'N/A'
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
});
