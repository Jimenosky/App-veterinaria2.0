require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDatabase } = require('./config/database');
const seedDatabase = require('./seed');

// Importar rutas
const authRoutes = require('./routes/auth');
const mascotasRoutes = require('./routes/mascotas');
const citasRoutes = require('./routes/citas');
const fixRoleRoutes = require('./routes/fix-role');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/mascotas', mascotasRoutes);
app.use('/api/v1/citas', citasRoutes);
app.use('/api/v1/fix', fixRoleRoutes);

// Ruta de prueba
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Backend funcionando correctamente con MySQL' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});

// Inicializar base de datos y servidor
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    console.log('🔄 Conectando a PostgreSQL...');
    await initDatabase();
    
    // Ejecutar seed para asegurar datos críticos
    console.log('🌱 Ejecutando seed de datos...');
    await seedDatabase();
    
    // Asegurar que admin tenga rol correcto
    const { runQuery } = require('./config/database');
    await runQuery(
      "UPDATE usuarios SET rol = $1 WHERE email = $2",
      ['admin', 'admin@veterinaria.com']
    );
    console.log('✅ Rol admin verificado');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`📡 CORS habilitado para todas las direcciones`);
      console.log(`🔗 http://localhost:${PORT}`);
      console.log(`🏥 API de Veterinaria lista`);
    });
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
})();

module.exports = app;
