function requiereAuth(req, res, next) {
  if (req.session && req.session.usuario) {
    next();
  } else {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
    } else {
      return res.redirect('/login.html');
    }
  }
}

module.exports = {
  requiereAuth
};
