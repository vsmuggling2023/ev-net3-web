const ticketService = require('../services/ticket.service');

async function listarTickets(req, res) {
  try {
    const tickets = await ticketService.obtenerTodosLosTickets();
    return res.status(200).json(tickets);
  } catch (error) {
    console.error('Error al listar tickets:', error);
    return res.status(500).json({ error: 'Error interno del servidor al listar los tickets.' });
  }
}

async function obtenerTicket(req, res) {
  try {
    const id = req.params.id;
    const ticket = await ticketService.obtenerTicketPorId(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado.' });
    }
    return res.status(200).json(ticket);
  } catch (error) {
    console.error('Error al obtener ticket:', error);
    return res.status(500).json({ error: 'Error interno del servidor al obtener el ticket.' });
  }
}

async function crear(req, res) {
  try {
    const nuevoTicket = await ticketService.crearTicket(req.body);
    return res.status(201).json({ success: true, id: nuevoTicket.id, ticket: nuevoTicket });
  } catch (error) {
    console.error('Error al crear ticket:', error);
    return res.status(500).json({ error: 'Error interno del servidor al crear el ticket.' });
  }
}

async function actualizar(req, res) {
  try {
    const id = req.params.id;
    const ticketActualizado = await ticketService.actualizarTicket(id, req.body);
    if (!ticketActualizado) {
      return res.status(404).json({ error: 'Ticket no encontrado.' });
    }
    return res.status(200).json({ success: true, ticket: ticketActualizado });
  } catch (error) {
    console.error('Error al actualizar ticket:', error);
    return res.status(500).json({ error: 'Error interno del servidor al actualizar el ticket.' });
  }
}

async function eliminar(req, res) {
  try {
    const id = req.params.id;
    const eliminado = await ticketService.eliminarTicket(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Ticket no encontrado.' });
    }
    return res.status(200).json({ success: true, mensaje: 'Ticket eliminado o cerrado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar ticket:', error);
    return res.status(500).json({ error: 'Error interno del servidor al eliminar el ticket.' });
  }
}

module.exports = {
  listarTickets,
  obtenerTicket,
  crear,
  actualizar,
  eliminar
};

