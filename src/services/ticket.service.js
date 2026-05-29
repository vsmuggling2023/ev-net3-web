const db = require('../data/db');
const priorityService = require('./priority.service');

async function obtenerTodosLosTickets() {
  const [rows] = await db.query(
    `SELECT t.*, u.nombre as usuario_asignado 
     FROM tickets t 
     LEFT JOIN usuarios u ON t.id_usuario = u.id 
     ORDER BY t.id DESC`
  );
  return rows.map(t => ({
    ...t,
    usuario_asignado: t.usuario_asignado || '—'
  }));
}

async function obtenerTicketPorId(id) {
  const [rows] = await db.query('SELECT * FROM tickets WHERE id = ?', [parseInt(id)]);
  if (rows.length === 0) return null;
  return rows[0];
}

async function crearTicket(datosTicket) {
  // Calcular prioridad
  const { prioridad } = priorityService.calcularPrioridad(datosTicket);

  const id_usuario = datosTicket.id_usuario ? parseInt(datosTicket.id_usuario) : null;
  const tiempoEstimado = datosTicket.tiempoEstimado ? parseFloat(datosTicket.tiempoEstimado) : null;
  const estado = datosTicket.estado || 'Pendiente';

  const [result] = await db.query(
    `INSERT INTO tickets (id_usuario, nombreSolicitante, correo, categoria, descripcion, impacto, urgencia, tiempoEstimado, estado, prioridad) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  , [
      id_usuario,
      datosTicket.nombreSolicitante,
      datosTicket.correo,
      datosTicket.categoria,
      datosTicket.descripcion,
      datosTicket.impacto,
      datosTicket.urgencia,
      tiempoEstimado,
      estado,
      prioridad
    ]);

  const nuevoTicket = await obtenerTicketPorId(result.insertId);
  return nuevoTicket;
}

async function actualizarTicket(id, datosTicket) {
  const ticketExistente = await obtenerTicketPorId(id);
  if (!ticketExistente) {
    return null;
  }

  // Combinar datos
  const ticketActualizado = {
    ...ticketExistente,
    nombreSolicitante: datosTicket.nombreSolicitante !== undefined ? datosTicket.nombreSolicitante : ticketExistente.nombreSolicitante,
    correo: datosTicket.correo !== undefined ? datosTicket.correo : ticketExistente.correo,
    categoria: datosTicket.categoria !== undefined ? datosTicket.categoria : ticketExistente.categoria,
    descripcion: datosTicket.descripcion !== undefined ? datosTicket.descripcion : ticketExistente.descripcion,
    impacto: datosTicket.impacto !== undefined ? datosTicket.impacto : ticketExistente.impacto,
    urgencia: datosTicket.urgencia !== undefined ? datosTicket.urgencia : ticketExistente.urgencia,
    tiempoEstimado: datosTicket.tiempoEstimado !== undefined ? (datosTicket.tiempoEstimado ? parseFloat(datosTicket.tiempoEstimado) : null) : ticketExistente.tiempoEstimado,
    estado: datosTicket.estado !== undefined ? datosTicket.estado : ticketExistente.estado,
    id_usuario: datosTicket.id_usuario !== undefined ? (datosTicket.id_usuario ? parseInt(datosTicket.id_usuario) : null) : ticketExistente.id_usuario
  };

  // Recalcular prioridad
  const { prioridad } = priorityService.calcularPrioridad(ticketActualizado);
  ticketActualizado.prioridad = prioridad;

  await db.query(
    `UPDATE tickets SET 
      id_usuario = ?, 
      nombreSolicitante = ?, 
      correo = ?, 
      categoria = ?, 
      descripcion = ?, 
      impacto = ?, 
      urgencia = ?, 
      tiempoEstimado = ?, 
      estado = ?, 
      prioridad = ? 
     WHERE id = ?`
  , [
      ticketActualizado.id_usuario,
      ticketActualizado.nombreSolicitante,
      ticketActualizado.correo,
      ticketActualizado.categoria,
      ticketActualizado.descripcion,
      ticketActualizado.impacto,
      ticketActualizado.urgencia,
      ticketActualizado.tiempoEstimado,
      ticketActualizado.estado,
      ticketActualizado.prioridad,
      parseInt(id)
    ]);

  return await obtenerTicketPorId(id);
}

async function eliminarTicket(id) {
  const [result] = await db.query('DELETE FROM tickets WHERE id = ?', [parseInt(id)]);
  return result.affectedRows > 0;
}

module.exports = {
  obtenerTodosLosTickets,
  obtenerTicketPorId,
  crearTicket,
  actualizarTicket,
  eliminarTicket
};

