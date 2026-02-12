const bcrypt = require('bcryptjs');
const { initDatabase, getQuery, runQuery } = require('./config/database');

async function seedDatabase() {
  try {
    // Si ya se inicializó, no llamar de nuevo
    // await initDatabase();

    // Verificar si el admin ya existe
    const adminExists = await getQuery('SELECT * FROM usuarios WHERE email = $1', [
      'admin@veterinaria.com',
    ]);

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);

      await runQuery(
        'INSERT INTO usuarios (nombre, email, password, telefono, direccion, rol) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          'Administrador',
          'admin@veterinaria.com',
          hashedPassword,
          '+34-123-456-789',
          'Clínica Veterinaria Central',
          'admin',
        ]
      );

      console.log('✅ Usuario admin creado: admin@veterinaria.com / password123');
    } else {
      console.log('✅ Usuario admin ya existe');
      
      // IMPORTANTE: Asegurar que el rol sea 'admin'
      await runQuery(
        'UPDATE usuarios SET rol = $1 WHERE email = $2',
        ['admin', 'admin@veterinaria.com']
      );
      console.log('✅ Rol del admin verificado/actualizado a "admin"');
    }

    // Crear cliente de prueba
    const clientExists = await getQuery('SELECT * FROM usuarios WHERE email = $1', [
      'cliente@ejemplo.com',
    ]);

    if (!clientExists) {
      const hashedPassword = await bcrypt.hash('cliente123', 10);

      await runQuery(
        'INSERT INTO usuarios (nombre, email, password, telefono, direccion, rol) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          'Cliente Ejemplo',
          'cliente@ejemplo.com',
          hashedPassword,
          '+34-987-654-321',
          'Calle Principal 123',
          'cliente',
        ]
      );

      console.log('✅ Usuario cliente creado: cliente@ejemplo.com / cliente123');
    } else {
      console.log('✅ Usuario cliente ya existe');
    }

    console.log('\n📊 Base de datos lista para usar\n');
  } catch (error) {
    console.error('Error en seed:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
}

// Solo ejecutar si se llama directamente como script
if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}

module.exports = seedDatabase;

