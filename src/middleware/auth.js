function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  // “Fake token” para práctica
  if (!token || token !== 'dev-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

module.exports = { auth };