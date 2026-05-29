const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const ticketRoutes = require('./routes/ticket.routes');
const { requiereAuth } = require('./middlewares/auth.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar JSON y formularios urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Sesión
app.use(session({
  secret: 'secreto_super_seguro_123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2 // 2 horas de duración
  }
}));

// Servir frontend estático antes de las rutas API
app.use(express.static(path.join(__dirname, 'public')));

// Redirección por defecto a login si no se especifica ruta
app.get('/', (req, res) => {
  if (req.session && req.session.usuario) {
    return res.redirect('/dashboard.html');
  }
  return res.redirect('/login.html');
});

// Proteger el acceso a los HTML principales excepto login
app.get('/dashboard.html', requiereAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
app.get('/ticket-crear.html', requiereAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ticket-crear.html'));
});
app.get('/ticket-editar.html', requiereAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ticket-editar.html'));
});

// Rutas de Autenticación
app.use('/', authRoutes);

// Rutas de Tickets (Soporta prefijos estándar y /api/ para compatibilidad)
app.use('/tickets', ticketRoutes);
app.use('/api/tickets', ticketRoutes);

// Middleware global para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ha ocurrido un error interno en el servidor.' });
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` HelpDesk Smart Priority corriendo exitosamente`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});

module.exports = app;
