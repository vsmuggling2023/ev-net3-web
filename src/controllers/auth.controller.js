const db = require('../data/db');
const dataManager = require('../data/data.manager');

async function login(req, res) {
  const { nombre, contrasena } = req.body;

  if (!nombre || !contrasena) {
    return res.status(400).json({ error: 'Nombre y contraseña requeridos.' });
  }

  const hash = dataManager.sha256(contrasena);

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE LOWER(nombre) = LOWER(?) AND contrasena = ?', [nombre, hash]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    const usuario = rows[0];

    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol
    };

    return res.json({ success: true, redirect: '/dashboard.html' });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error en el servidor al iniciar sesión.' });
  }
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión.' });
    }
    return res.redirect('/login.html');
  });
}

function obtenerUsuarioActual(req, res) {
  if (req.session && req.session.usuario) {
    return res.json(req.session.usuario);
  }
  return res.status(401).json({ error: 'No autenticado.' });
}

async function obtenerTodosLosUsuarios(req, res) {
  try {
    const [rows] = await db.query('SELECT id, nombre, rol FROM usuarios');
    return res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ error: 'Error en el servidor al obtener los usuarios.' });
  }
}

module.exports = {
  login,
  logout,
  obtenerUsuarioActual,
  obtenerTodosLosUsuarios
};

