const bcrypt = require('bcryptjs');
const { initDatabase, getQuery, runQuery } = require('./config/database');

async function seedDatabase() {
  try {
    await initDatabase();

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
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
}

seedDatabase();

