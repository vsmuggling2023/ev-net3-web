const ticketService = require('../services/ticket.service');

function validarTicket(req, res, next) {
  const { nombreSolicitante, correo, categoria, descripcion, impacto, urgencia } = req.body;
  const errores = [];

  // Campos obligatorios
  if (!nombreSolicitante || nombreSolicitante.trim() === '') {
    errores.push('El nombre del solicitante es obligatorio.');
  }
  if (!correo || correo.trim() === '') {
    errores.push('El correo es obligatorio.');
  }
  if (!categoria || categoria.trim() === '') {
    errores.push('La categoría es obligatoria.');
  }
  if (!descripcion || descripcion.trim() === '') {
    errores.push('La descripción es obligatoria.');
  }
  if (!impacto || impacto.trim() === '') {
    errores.push('El impacto es obligatorio.');
  }
  if (!urgencia || urgencia.trim() === '') {
    errores.push('La urgencia es obligatoria.');
  }

  // Formato de correo
  if (correo) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      errores.push('El correo electrónico tiene un formato inválido.');
    }
  }

  // Valores válidos de impacto y urgencia
  const impactosValidos = ['bajo', 'medio', 'alto'];
  const urgenciasValidas = ['baja', 'media', 'alta'];

  if (impacto && !impactosValidos.includes(impacto.toLowerCase())) {
    errores.push('El impacto debe ser "bajo", "medio" o "alto".');
  }

  if (urgencia && !urgenciasValidas.includes(urgencia.toLowerCase())) {
    errores.push('La urgencia debe ser "baja", "media" o "alta".');
  }

  // Retornar errores de validación si existen
  if (errores.length > 0) {
    return res.status(400).json({ error: errores.join(' ') });
  }

  next();
}

function validarIdTicketExistente(req, res, next) {
  const id = req.params.id;
  const ticket = ticketService.obtenerTicketPorId(id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket no encontrado con el ID proporcionado.' });
  }
  next();
}

module.exports = {
  validarTicket,
  validarIdTicketExistente
};
