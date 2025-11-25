const db = require('../database');

const Contact = {
  // Trouver le contact (il n'y en a qu'un)
  findOne: () => {
    return db.prepare('SELECT * FROM contacts LIMIT 1').get();
  },

  // Créer ou mettre à jour le contact
  createOrUpdate: (data) => {
    const existing = Contact.findOne();
    
    if (existing) {
      // Mettre à jour
      const stmt = db.prepare(`
        UPDATE contacts 
        SET phone = ?, email = ?, address = ?, mapsLink = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(data.phone, data.email, data.address, data.mapsLink || '', existing.id);
      return Contact.findOne();
    } else {
      // Créer
      const stmt = db.prepare(`
        INSERT INTO contacts (phone, email, address, mapsLink)
        VALUES (?, ?, ?, ?)
      `);
      stmt.run(data.phone, data.email, data.address, data.mapsLink || '');
      return Contact.findOne();
    }
  },

  // Compter les contacts
  count: () => {
    return db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;
  }
};

module.exports = Contact;
