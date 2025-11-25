const db = require('../database');

const Category = {
  // Trouver toutes les catégories
  findAll: () => {
    return db.prepare('SELECT * FROM categories ORDER BY `order` ASC').all();
  },

  // Trouver par ID
  findById: (id) => {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  },

  // Trouver par nom
  findByName: (name) => {
    return db.prepare('SELECT * FROM categories WHERE name = ?').get(name);
  },

  // Créer une catégorie
  create: (data) => {
    const stmt = db.prepare('INSERT INTO categories (name, `order`) VALUES (?, ?)');
    const result = stmt.run(data.name, data.order || 0);
    return Category.findById(result.lastInsertRowid);
  },

  // Mettre à jour une catégorie
  update: (id, data) => {
    const updates = [];
    const values = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.order !== undefined) {
      updates.push('`order` = ?');
      values.push(data.order);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return Category.findById(id);
  },

  // Supprimer une catégorie
  delete: (id) => {
    const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
    return stmt.run(id);
  },

  // Compter les catégories
  count: () => {
    return db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
  }
};

module.exports = Category;
