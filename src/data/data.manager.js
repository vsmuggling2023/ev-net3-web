const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TICKETS_FILE = path.join(__dirname, 'tickets.json');
const USERS_FILE = path.join(__dirname, 'users.json');

function sha256(texto) {
  return crypto.createHash('sha256').update(texto).digest('hex');
}

// Inicializar archivos si no existen
function inicializarDatos() {
  if (!fs.existsSync(TICKETS_FILE)) {
    fs.writeFileSync(TICKETS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  
  if (!fs.existsSync(USERS_FILE)) {
    const usuariosIniciales = [
      {
        id: 1,
        nombre: 'admin',
        contrasena: sha256('admin123'),
        rol: 'Administrador'
      },
      {
        id: 2,
        nombre: 'docente1',
        contrasena: sha256('docente123'),
        rol: 'Docente'
      },
      {
        id: 3,
        nombre: 'estudiante1',
        contrasena: sha256('estudiante123'),
        rol: 'Estudiante'
      },
      {
        id: 4,
        nombre: 'funcionario1',
        contrasena: sha256('funcionario123'),
        rol: 'Funcionario'
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(usuariosIniciales, null, 2), 'utf-8');
  }
}

inicializarDatos();

function obtenerTickets() {
  try {
    const data = fs.readFileSync(TICKETS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer tickets.json:', error);
    return [];
  }
}

function guardarTickets(tickets) {
  try {
    fs.writeFileSync(TICKETS_FILE, JSON.stringify(tickets, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error al guardar tickets.json:', error);
    return false;
  }
}

function obtenerUsuarios() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer users.json:', error);
    return [];
  }
}

module.exports = {
  obtenerTickets,
  guardarTickets,
  obtenerUsuarios,
  sha256
};
