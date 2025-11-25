const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_default');
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authMiddleware;