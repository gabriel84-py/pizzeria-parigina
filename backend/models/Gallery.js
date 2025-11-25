const db = require('../database');

const Gallery = {
  // Trouver toutes les images
  findAll: () => {
    return db.prepare('SELECT * FROM gallery ORDER BY `order` ASC').all();
  },

  // Trouver par ID
  findById: (id) => {
    return db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
  },

  // Créer une image
  create: (data) => {
    const stmt = db.prepare(`
      INSERT INTO gallery (imageUrl, alt, \`order\`)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(
      data.imageUrl,
      data.alt || 'Pizzeria Parigina',
      data.order || 0
    );
    return Gallery.findById(result.lastInsertRowid);
  },

  // Mettre à jour une image
  update: (id, data) => {
    const updates = [];
    const values = [];

    if (data.imageUrl !== undefined) {
      updates.push('imageUrl = ?');
      values.push(data.imageUrl);
    }
    if (data.alt !== undefined) {
      updates.push('alt = ?');
      values.push(data.alt);
    }
    if (data.order !== undefined) {
      updates.push('`order` = ?');
      values.push(data.order);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE gallery SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return Gallery.findById(id);
  },

  // Supprimer une image
  delete: (id) => {
    const stmt = db.prepare('DELETE FROM gallery WHERE id = ?');
    return stmt.run(id);
  }
};

module.exports = Gallery;
