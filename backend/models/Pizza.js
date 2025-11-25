const db = require('../database');

const Pizza = {
  // Trouver toutes les pizzas
  findAll: () => {
    return db.prepare('SELECT * FROM pizzas ORDER BY `order` ASC, name ASC').all();
  },

  // Trouver par ID
  findById: (id) => {
    return db.prepare('SELECT * FROM pizzas WHERE id = ?').get(id);
  },

  // Trouver par catégorie
  findByCategory: (category) => {
    return db.prepare('SELECT * FROM pizzas WHERE category = ? ORDER BY `order` ASC, name ASC').all(category);
  },

  // Créer une pizza
  create: (data) => {
    const stmt = db.prepare(`
      INSERT INTO pizzas (name, ingredients, price, category, available, imageUrl, \`order\`)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.name,
      data.ingredients,
      data.price,
      data.category,
      data.available !== undefined ? (data.available ? 1 : 0) : 1,
      data.imageUrl || '',
      data.order || 0
    );
    return Pizza.findById(result.lastInsertRowid);
  },

  // Mettre à jour une pizza
  update: (id, data) => {
    const updates = [];
    const values = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.ingredients !== undefined) {
      updates.push('ingredients = ?');
      values.push(data.ingredients);
    }
    if (data.price !== undefined) {
      updates.push('price = ?');
      values.push(data.price);
    }
    if (data.category !== undefined) {
      updates.push('category = ?');
      values.push(data.category);
    }
    if (data.available !== undefined) {
      updates.push('available = ?');
      values.push(data.available ? 1 : 0);
    }
    if (data.imageUrl !== undefined) {
      updates.push('imageUrl = ?');
      values.push(data.imageUrl);
    }
    if (data.order !== undefined) {
      updates.push('`order` = ?');
      values.push(data.order);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE pizzas SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return Pizza.findById(id);
  },

  // Supprimer une pizza
  delete: (id) => {
    const stmt = db.prepare('DELETE FROM pizzas WHERE id = ?');
    return stmt.run(id);
  },

  // Compter les pizzas
  count: () => {
    return db.prepare('SELECT COUNT(*) as count FROM pizzas').get().count;
  }
};

module.exports = Pizza;
