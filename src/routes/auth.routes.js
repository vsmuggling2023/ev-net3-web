const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requiereAuth } = require('../middlewares/auth.middleware');

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/api/usuario', requiereAuth, authController.obtenerUsuarioActual);
router.get('/api/usuarios', requiereAuth, authController.obtenerTodosLosUsuarios);

module.exports = router;
