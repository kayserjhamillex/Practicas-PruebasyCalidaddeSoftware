function requireAuth(req, res, next) {
  const userId = req.header('x-user-id'); // simple para laboratorio

  if (!userId) {
    return res.redirect(302, '/login');
  }

  req.user = { id: Number(userId) || userId };
  return next();
}

module.exports = { requireAuth };