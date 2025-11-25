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

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzeria_parigina', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connecté'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

app.use('/api/pizzas', require('./routes/pizzas'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/hours', require('./routes/hours'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Pizzeria Parigina opérationnelle' });
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
