const jwt = require('jsonwebtoken');
const SECRET = 'mi_secreto_super_seguro'; // ideal en env

function auth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Falta el token' });

  const token = header.split(' ')[1];
  try {
    const decodificado = jwt.verify(token, SECRET);
    req.user = decodificado;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = auth;