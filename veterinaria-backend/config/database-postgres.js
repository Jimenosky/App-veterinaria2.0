const { Pool } = require('pg');
require('dotenv').config();

let pool = null;

const initDatabase = async () => {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Probar conexión
    const client = await pool.connect();
    console.log('✅ Conectado a PostgreSQL exitosamente');
    client.release();

    // Crear tablas si no existen
    await createTables();

    return pool;
  } catch (error) {
    console.error('Error al conectar a PostgreSQL:', error.message);
    throw error;
  }
};

const createTables = async () => {
  const client = await pool.connect();
  try {
    // Tabla de Usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        telefono VARCHAR(20),
        direccion VARCHAR(255),
        rol VARCHAR(20) DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
        estado VARCHAR(50) DEFAULT 'activo',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de Mascotas
    await client.query(`
      CREATE TABLE IF NOT EXISTS mascotas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        tipo VARCHAR(100) NOT NULL,
        raza VARCHAR(100),
        edad INT,
        peso DECIMAL(5, 2),
        usuario_id INT NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);

    // Crear índice si no existe
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_mascotas_usuario ON mascotas(usuario_id)
    `);

    // Tabla de Citas
    await client.query(`
      CREATE TABLE IF NOT EXISTS citas (
        id SERIAL PRIMARY KEY,
        usuario_id INT NOT NULL,
        mascota_id INT NOT NULL,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        tipo_servicio VARCHAR(255) NOT NULL,
        descripcion TEXT,
        estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
        costo DECIMAL(10, 2),
        notas_admin TEXT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
      )
    `);

    // Crear índices si no existen
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_citas_usuario ON citas(usuario_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_citas_mascota ON citas(mascota_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(fecha)
    `);

    console.log('✅ Tablas de base de datos verificadas');
  } catch (error) {
    if (error.code !== '42P07') { // 42P07 = table already exists
      throw error;
    }
  } finally {
    client.release();
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Pool de conexión no inicializado');
  }
  return pool;
};

const runQuery = async (query, params = []) => {
  const client = await getPool().connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
};

const getQuery = async (query, params = []) => {
  const client = await getPool().connect();
  try {
    const result = await client.query(query, params);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const allQuery = async (query, params = []) => {
  const client = await getPool().connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
};

module.exports = {
  initDatabase,
  getPool,
  runQuery,
  getQuery,
  allQuery,
};
