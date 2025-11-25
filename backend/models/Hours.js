const db = require('../database');

const Hours = {
  // Trouver tous les horaires
  findAll: () => {
    return db.prepare('SELECT * FROM hours ORDER BY `order` ASC').all();
  },

  // Trouver par ID
  findById: (id) => {
    return db.prepare('SELECT * FROM hours WHERE id = ?').get(id);
  },

  // Créer un horaire
  create: (data) => {
    const stmt = db.prepare(`
      INSERT INTO hours (day, open, close, closed, \`order\`)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.day,
      data.open || '',
      data.close || '',
      data.closed ? 1 : 0,
      data.order
    );
    return Hours.findById(result.lastInsertRowid);
  },

  // Mettre à jour un horaire
  update: (id, data) => {
    const updates = [];
    const values = [];

    if (data.day !== undefined) {
      updates.push('day = ?');
      values.push(data.day);
    }
    if (data.open !== undefined) {
      updates.push('open = ?');
      values.push(data.open);
    }
    if (data.close !== undefined) {
      updates.push('close = ?');
      values.push(data.close);
    }
    if (data.closed !== undefined) {
      updates.push('closed = ?');
      values.push(data.closed ? 1 : 0);
    }
    if (data.order !== undefined) {
      updates.push('`order` = ?');
      values.push(data.order);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE hours SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return Hours.findById(id);
  },

  // Supprimer un horaire
  delete: (id) => {
    const stmt = db.prepare('DELETE FROM hours WHERE id = ?');
    return stmt.run(id);
  },

  // Compter les horaires
  count: () => {
    return db.prepare('SELECT COUNT(*) as count FROM hours').get().count;
  }
};

module.exports = Hours;
