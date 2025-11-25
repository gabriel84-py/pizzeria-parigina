const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');
const authMiddleware = require('../middleware/auth');

// Helper pour convertir les résultats SQLite en format compatible
function formatPizza(pizza) {
  if (!pizza) return null;
  return {
    _id: pizza.id.toString(),
    id: pizza.id,
    name: pizza.name,
    ingredients: pizza.ingredients,
    price: pizza.price,
    category: pizza.category,
    available: pizza.available === 1,
    imageUrl: pizza.imageUrl || '',
    order: pizza.order || 0,
    createdAt: pizza.created_at,
    updatedAt: pizza.updated_at
  };
}

router.get('/', (req, res) => {
  try {
    const pizzas = Pizza.findAll();
    res.json(pizzas.map(formatPizza));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/category/:category', (req, res) => {
  try {
    const pizzas = Pizza.findByCategory(req.params.category);
    res.json(pizzas.map(formatPizza));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const pizza = Pizza.create(req.body);
    res.status(201).json(formatPizza(pizza));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Helper pour convertir l'ID (peut être string ou number)
function parseId(id) {
  return typeof id === 'string' ? parseInt(id) : id;
}

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const pizza = Pizza.update(parseId(req.params.id), req.body);
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza non trouvée' });
    }
    res.json(formatPizza(pizza));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const result = Pizza.delete(parseId(req.params.id));
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Pizza non trouvée' });
    }
    res.json({ message: 'Pizza supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/init', (req, res) => {
  try {
    const count = Pizza.count();
    if (count > 0) {
      return res.status(400).json({ error: 'Pizzas déjà initialisées' });
    }

    const pizzas = [
      { name: 'MARGHERITA', ingredients: 'Tomate*, mozzarella*, parmigiano, Basilic, Huile d\'olive', price: 11, category: 'Base Rouge', order: 1 },
      { name: 'BUFALA', ingredients: 'Tomate*, mozzarella*, parmigiano, Basilic, Tomates cerises, huile d\'olive, Après cuisson : mozzarella di Bufala', price: 14, category: 'Base Rouge', order: 2 },
      { name: 'ROMA', ingredients: 'Tomate*, mozzarella*, jambon cuit Italien, Olives*', price: 13, category: 'Base Rouge', order: 3 },
      { name: 'REGINA', ingredients: 'Tomate*, mozzarella*, champignons frais, Jambon cuit Italien, olives*', price: 14, category: 'Base Rouge', order: 4 },
      { name: '4 STAGIONI', ingredients: 'Tomate*, mozzarella*, champignons frais, Artichauts è la romaine, jambon cuit Italien, Olives', price: 16, category: 'Base Rouge', order: 5 },
      { name: 'NAPOLI', ingredients: 'Tomate*, mozzarella*, anchois de Cetara, Fleurs de câpres, olives', price: 14, category: 'Base Rouge', order: 6 },
      { name: 'CAPRI', ingredients: 'Tomate*, mozzarella*, thon Italien, Fleurs de câpres, oignons rouges, olives', price: 16, category: 'Base Rouge', order: 7 },
      { name: 'PARMIGIANA', ingredients: 'Tomate*, mozzarella*, aubergines frites, Tomates cerises, Parmigiano Reggiano 24 mois', price: 14, category: 'Base Rouge', order: 8 },
      { name: 'VEGETARIENNE', ingredients: 'Tomate*, mozzarella, champignons frais, Aubergines et courgettes frites, artichauts A la romaine, tomates cerises', price: 15, category: 'Base Rouge', order: 9 },
      { name: '4 FORMAGGI', ingredients: 'Tomate*, mozzarella*, gorgonzola, Taleggio, chèvre', price: 15, category: 'Base Rouge', order: 10 },
      { name: 'PICCANTA', ingredients: 'Tomate*, mozzarella, spianata, olives*', price: 14, category: 'Base Rouge', order: 11 },
      { name: 'SICILIENNE', ingredients: 'Tomate*, mozzarella*, champignons frais, Spianata, jambon cuit italien, olives*', price: 16, category: 'Base Rouge', order: 12 },
      { name: 'CORSICA', ingredients: 'Tomate*, mozzarella*, figatelli, brossu, Ou brousse corse, tomate confite', price: 17, category: 'Base Rouge', order: 13 },
      { name: 'PARMA', ingredients: 'Tomate*, mozzarella*, tomates cerises, Après cuisson : jambon parme 24 mois, Mozzarella di Bufala, tomates confites, Parmigiano reggiano 24mois, Huile d\'olive, crème balsamique', price: 18, category: 'Base Blanche', order: 14 },
      { name: 'TARTUFO', ingredients: 'Crème de trufe, mozzarella*, jambon cuit Italien, huile d\'olive à la truffe noire', price: 15, category: 'Base Blanche', order: 15 },
      { name: 'MIEL DI CAPRA', ingredients: 'Crème, mozzarella*, chèvre, miel artisanal, Amandes effilées', price: 14, category: 'Base Blanche', order: 16 },
      { name: 'CARBONARA', ingredients: 'Crème, mozzarella*, guanciale*, coppa, Pecorino poivré', price: 17, category: 'Base Blanche', order: 17 },
      { name: 'MONTAGNA', ingredients: 'Crème, mozzarella*, fontina*, Après cuisson : jambon de parme', price: 18, category: 'Base Blanche', order: 18 },
      { name: 'TOSCANE', ingredients: 'Crème, mozzarella*, gorgonzola, Après cuisson : jambon de parme, Parmigiano reggiano', price: 17, category: 'Base Blanche', order: 19 },
      { name: 'LANDAISE', ingredients: 'Crème de cèpes, mozzarella*, Après cuisson : Magret de canard fumé du sud-ouest, Confit de figues', price: 17, category: 'Base Blanche', order: 20 },
      { name: 'ROQUETTE', ingredients: 'Après cuisson : roquette, Jambon de parme 24 mois, Parmigiano reggiano 24 mois, Tomates confites, huile d\'olive, Crème balsamique', price: 17, category: 'Base Blanche', order: 21 }
    ];

    pizzas.forEach(pizza => Pizza.create(pizza));
    res.json({ message: 'Pizzas initialisées avec succès', count: pizzas.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
