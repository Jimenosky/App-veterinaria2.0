const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

const initDatabase = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'usuarios_db',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Probar conexión
    const connection = await pool.getConnection();
    console.log('✅ Conectado a MySQL exitosamente');
    connection.release();

    // Crear tablas si no existen
    await createTables();

    return pool;
  } catch (error) {
    console.error('Error al conectar a MySQL:', error.message);
    throw error;
  }
};

const createTables = async () => {
  const connection = await pool.getConnection();
  try {
    // Tabla de Usuarios
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        telefono VARCHAR(20),
        direccion VARCHAR(255),
        rol ENUM('cliente', 'admin') DEFAULT 'cliente',
        estado VARCHAR(50) DEFAULT 'activo',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de Mascotas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS mascotas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        tipo VARCHAR(100) NOT NULL,
        raza VARCHAR(100),
        edad INT,
        peso DECIMAL(5, 2),
        usuario_id INT NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_usuario (usuario_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de Citas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS citas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        mascota_id INT NOT NULL,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        tipo_servicio VARCHAR(255) NOT NULL,
        descripcion TEXT,
        estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
        costo DECIMAL(10, 2),
        notas_admin TEXT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
        INDEX idx_usuario (usuario_id),
        INDEX idx_mascota (mascota_id),
        INDEX idx_fecha (fecha)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Tablas de base de datos verificadas');
  } catch (error) {
    if (error.code !== 'ER_TABLE_EXISTS_ERROR') {
      throw error;
    }
  } finally {
    connection.release();
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Pool de conexión no inicializado');
  }
  return pool;
};

const runQuery = async (query, params = []) => {
  const connection = await getPool().getConnection();
  try {
    const [result] = await connection.execute(query, params);
    return result;
  } finally {
    connection.release();
  }
};

const getQuery = async (query, params = []) => {
  const connection = await getPool().getConnection();
  try {
    const [rows] = await connection.execute(query, params);
    return rows[0];
  } finally {
    connection.release();
  }
};

const allQuery = async (query, params = []) => {
  const connection = await getPool().getConnection();
  try {
    const [rows] = await connection.execute(query, params);
    return rows;
  } finally {
    connection.release();
  }
};

module.exports = {
  initDatabase,
  getPool,
  runQuery,
  getQuery,
  allQuery,
};
