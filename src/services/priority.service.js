function calcularPrioridad(ticket) {
  let impactoPuntos = 0;
  switch (ticket.impacto) {
    case 'bajo':
      impactoPuntos = 1;
      break;
    case 'medio':
      impactoPuntos = 2;
      break;
    case 'alto':
      impactoPuntos = 3;
      break;
    default:
      impactoPuntos = 1;
  }

  let urgenciaPuntos = 0;
  switch (ticket.urgencia) {
    case 'baja':
      urgenciaPuntos = 1;
      break;
    case 'media':
      urgenciaPuntos = 2;
      break;
    case 'alta':
      urgenciaPuntos = 3;
      break;
    default:
      urgenciaPuntos = 1;
  }

  let bonusCategoria = 0;
  if (ticket.categoria === 'red' || ticket.categoria === 'cuenta') {
    bonusCategoria = 1;
  }

  let bonusTiempo = 0;
  if (ticket.tiempoEstimado && parseFloat(ticket.tiempoEstimado) > 4) {
    bonusTiempo = 1;
  }

  const puntajeTotal = impactoPuntos + urgenciaPuntos + bonusCategoria + bonusTiempo;

  let prioridad = 'Baja';
  if (puntajeTotal >= 7) {
    prioridad = 'Crítica';
  } else if (puntajeTotal === 6) {
    prioridad = 'Alta';
  } else if (puntajeTotal >= 4) {
    prioridad = 'Media';
  }

  return {
    puntajeTotal,
    prioridad
  };
}

module.exports = {
  calcularPrioridad
};
