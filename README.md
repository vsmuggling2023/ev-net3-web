# HelpDesk Smart Priority

HelpDesk Smart Priority es una solución web para la gestión eficiente y estructurada de tickets de soporte técnico en instituciones educativas. La aplicación permite a estudiantes, docentes y funcionarios registrar incidentes y solicitudes, calculando de manera automática la prioridad de cada caso según reglas del negocio para optimizar los tiempos de respuesta.

---

## 🏗️ Arquitectura por Capas

El proyecto está diseñado bajo una arquitectura limpia por capas separadas en la carpeta `src/`, lo que permite un mantenimiento sencillo y escalabilidad:

- **`src/app.js`**: Punto de entrada principal y configuración del servidor Express, middlewares globales y enrutadores.
- **`routes/`**: Define los endpoints expuestos y mapea las peticiones HTTP a los controladores correspondientes (`auth.routes.js`, `ticket.routes.js`).
- **`controllers/`**: Maneja el objeto request/response HTTP, llama a los servicios de negocio correspondientes y retorna respuestas estructuradas (`auth.controller.js`, `ticket.controller.js`).
- **`services/`**: Contiene la lógica del negocio principal y las reglas del algoritmo de prioridad (`ticket.service.js`, `priority.service.js`).
- **`data/`**: Capa de persistencia. Se conecta a la base de datos relacional MySQL/MariaDB (`db.js`) utilizando un pool de conexiones optimizado.
- **`middlewares/`**: Valida que los datos ingresados cumplan con las reglas requeridas y verifica que el usuario tenga sesión activa antes de acceder a rutas de escritura y lectura protegidas.
- **`public/`**: Interfaz de usuario interactiva y moderna (diseño premium de cristal y micro-animaciones).

---

## 💾 Base de Datos

La aplicación utiliza una base de datos relacional llamada **`helpsmart`**. A continuación, se presenta la estructura de las tablas necesarias para el correcto funcionamiento del sistema:

### Estructura SQL (Schema)

```sql
-- Creación de la base de datos (opcional si ya existe)
CREATE DATABASE IF NOT EXISTS helpsmart;
USE helpsmart;

-- Tabla de Usuarios
CREATE TABLE usuarios(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(20),
    contrasena VARCHAR(200),
    rol VARCHAR(15)
);

-- Inserción del usuario administrador por defecto
-- Contraseña en texto plano: admin (hash SHA-256)
INSERT INTO usuarios(nombre, contrasena, rol) 
VALUES ("admin", "bc6587795c6c65f810d1f8544a6f6ac051f089e581f8c361ae41d70de922972c", "admin");

-- Tabla de Tickets
CREATE TABLE tickets(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    nombreSolicitante VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    categoria ENUM('hardware', 'software', 'red', 'cuenta', 'otro') NOT NULL,
    descripcion TEXT NOT NULL,
    impacto ENUM('bajo', 'medio', 'alto') NOT NULL,
    urgencia ENUM('baja', 'media', 'alta') NOT NULL,
    tiempoEstimado DECIMAL(5,2),
    estado ENUM('Pendiente', 'En proceso', 'Resuelto') DEFAULT 'Pendiente',
    prioridad VARCHAR(20),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
```

---

## ⚡ Algoritmo de Priorización

La prioridad del ticket se calcula sumando puntos de acuerdo a los siguientes factores:

1. **Impacto**:
   - Bajo: 1 punto
   - Medio: 2 puntos
   - Alto: 3 puntos
2. **Urgencia**:
   - Baja: 1 punto
   - Media: 2 puntos
   - Alta: 3 puntos
3. **Bonus de Categoría**:
   - Si la categoría es **"red"** o **"cuenta"**, se suma +1 punto.
4. **Bonus de Tiempo Estimado**:
   - Si el tiempo estimado es mayor a **4 horas**, se suma +1 punto.

### Resultados de Prioridad según Puntaje Total
- **1 a 3 puntos**: Baja
- **4 a 5 puntos**: Media
- **6 puntos**: Alta
- **7 o más puntos**: Crítica

---

## 🛡️ Explicación de Seguridad: HTTPS

### ¿Qué es HTTPS?
**HTTPS** (Hypertext Transfer Protocol Secure) es la versión segura del protocolo HTTP. Utiliza cifrado SSL/TLS para asegurar el canal de comunicación entre el navegador del usuario y el servidor web.

### ¿Qué riesgos ayuda a mitigar?
1. **Ataques Man-in-the-Middle (MitM)**: Evita que intermediarios (como ISPs maliciosos, routers comprometidos o redes Wi-Fi públicas) puedan interceptar y leer las credenciales o los datos de soporte de la institución.
2. **Eavesdropping (Escucha pasiva)**: Los datos transmitidos (usuarios, contraseñas, correos y descripciones de tickets) viajan cifrados, impidiendo que terceros los capturen.
3. **Alteración de Datos (Tampering)**: HTTPS garantiza la integridad de los datos, previniendo que un atacante inyecte scripts maliciosos, modifique respuestas o altere el contenido de un ticket en tránsito.

### ¿Por qué es importante en aplicaciones web?
En una aplicación web como un HelpDesk, se maneja información sensible como datos personales (correos, nombres de estudiantes y docentes) y contraseñas de acceso. Implementar HTTPS protege la privacidad de los usuarios, previene filtraciones de accesos y genera confianza en los miembros de la institución.

---

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express, Express-Session, Crypto.
- **Base de Datos**: MySQL / MariaDB (Driver `mysql2`).
- **Frontend**: HTML5, Vanilla CSS3 (diseño premium Glassmorphism y micro-animaciones), Bootstrap 5.3, Fetch API.

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js instalado (v16.0.0 o superior recomendado).
- Servidor MySQL / MariaDB activo.

### Configuración del Entorno
Puedes configurar las siguientes variables de entorno en tu sistema o mediante un archivo de entorno, o bien verificar los valores por defecto en [db.js](file:///g:/Mouli/Desktop/Trabajo-Web-I/src/data/db.js):
- `DB_HOST`: Host de la base de datos (por defecto: `localhost`).
- `DB_USER`: Usuario de la base de datos (por defecto: `root`).
- `DB_PASSWORD`: Contraseña del usuario de la base de datos (por defecto: `181730366u`).
- `DB_NAME`: Nombre de la base de datos (por defecto: `helpsmart`).
- `DB_PORT`: Puerto de la base de datos (por defecto: `3306`).

### Pasos
1. Descarga o clona el repositorio del proyecto.
2. Crea la base de datos `helpsmart` y ejecuta el script SQL provisto arriba para crear las tablas e insertar el usuario administrador.
3. Abre la terminal en el directorio raíz del proyecto e instala las dependencias necesarias:
   ```bash
   npm install express express-session mysql2 cheerio
   ```
4. Ejecuta el servidor:
   ```bash
   npm start
   ```
5. Abre tu navegador e ingresa a: `http://localhost:3000`

### 🔑 Credenciales de Prueba
Se ha pre-cargado el usuario administrador a través de la inserción SQL:
- **Usuario**: `admin` | **Contraseña**: `admin` (la cual se valida contra su hash SHA-256 en la base de datos).

---

## 🔗 Endpoints del Sistema

| Método | Endpoint | Descripción | Requiere Autenticación |
| :--- | :--- | :--- | :---: |
| **POST** | `/login` | Inicia sesión del usuario | No |
| **GET** | `/logout` | Cierra la sesión activa | Sí |
| **GET** | `/tickets` o `/api/tickets` | Lista todos los tickets registrados | Sí |
| **POST** | `/tickets` o `/api/tickets` | Registra un nuevo ticket de soporte | Sí |
| **GET** | `/tickets/:id` o `/api/tickets/:id` | Obtiene el detalle de un ticket específico | Sí |
| **PUT** | `/tickets/:id` o `/api/tickets/:id` | Modifica un ticket de soporte registrado | Sí |
| **DELETE** | `/tickets/:id` o `/api/tickets/:id` | Elimina o cierra un ticket | Sí |
| **GET** | `/api/usuario` | Obtiene los datos del usuario logueado actualmente | Sí |
| **GET** | `/api/usuarios` | Lista los usuarios del sistema para asignación | Sí |
