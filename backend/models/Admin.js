const db = require('../database');
const bcrypt = require('bcryptjs');

const Admin = {
  // Trouver par username
  findByUsername: (username) => {
    return db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  },

  // Trouver par ID
  findById: (id) => {
    return db.prepare('SELECT * FROM admins WHERE id = ?').get(id);
  },

  // Créer un admin
  create: async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const stmt = db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)');
    const result = stmt.run(data.username, hashedPassword);
    return Admin.findById(result.lastInsertRowid);
  },

  // Mettre à jour un admin
  update: async (id, data) => {
    const updates = [];
    const values = [];

    if (data.username !== undefined) {
      updates.push('username = ?');
      values.push(data.username);
    }
    if (data.password !== undefined) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE admins SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return Admin.findById(id);
  },

  // Comparer le mot de passe
  comparePassword: async (hashedPassword, candidatePassword) => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  },

  // Compter les admins
  count: () => {
    return db.prepare('SELECT COUNT(*) as count FROM admins').get().count;
  }
};

module.exports = Admin;
