const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { requiereAuth } = require('../middlewares/auth.middleware');
const { validarTicket, validarIdTicketExistente } = require('../middlewares/validation.middleware');

router.get('/', requiereAuth, ticketController.listarTickets);
router.post('/', requiereAuth, validarTicket, ticketController.crear);

router.get('/:id', requiereAuth, validarIdTicketExistente, ticketController.obtenerTicket);
router.put('/:id', requiereAuth, validarIdTicketExistente, validarTicket, ticketController.actualizar);
router.patch('/:id', requiereAuth, validarIdTicketExistente, ticketController.actualizar);
router.delete('/:id', requiereAuth, validarIdTicketExistente, ticketController.eliminar);

module.exports = router;
