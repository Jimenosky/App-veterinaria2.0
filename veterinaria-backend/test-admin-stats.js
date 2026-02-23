// Script para probar los endpoints del admin con datos reales

const API_URL = 'https://api-express-mysql-de-jime.onrender.com';

async function testAdminStats() {
  console.log('🔄 Probando endpoints de Render...\n');

  try {
    // Primero hacer login como admin para obtener el token
    console.log('1️⃣ Login como admin...');
    const loginResponse = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'Password1!',
      }),
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      console.error('❌ Error en login:', loginData.message);
      return;
    }

    const token = loginData.data.token;
    console.log('✅ Login exitoso');
    console.log('📋 Usuario:', loginData.data.user.nombre);
    console.log('🔑 Rol:', loginData.data.user.rol);
    console.log('---');

    // Probar endpoint de usuarios
    console.log('\n2️⃣ Obteniendo usuarios...');
    const usersResponse = await fetch(`${API_URL}/api/v1/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const usersData = await usersResponse.json();
    if (usersData.success) {
      const totalUsuarios = usersData.data.length;
      console.log('✅ Total Usuarios:', totalUsuarios);
      console.log('📋 Primeros 3 usuarios:');
      usersData.data.slice(0, 3).forEach((user, idx) => {
        console.log(`   ${idx + 1}. ${user.nombre} (${user.rol}) - ${user.email}`);
      });
    } else {
      console.error('❌ Error:', usersData.message);
    }

    // Probar endpoint de citas
    console.log('\n3️⃣ Obteniendo citas...');
    const citasResponse = await fetch(`${API_URL}/api/v1/citas/admin/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const citasData = await citasResponse.json();
    if (citasData.success) {
      const totalCitas = citasData.data.length;
      const citasPendientes = citasData.data.filter(c => c.estado === 'pendiente').length;
      console.log('✅ Total Citas:', totalCitas);
      console.log('⏰ Citas Pendientes:', citasPendientes);
      console.log('📋 Primeras 3 citas:');
      citasData.data.slice(0, 3).forEach((cita, idx) => {
        console.log(`   ${idx + 1}. ${cita.usuario_nombre} - ${cita.mascota_nombre} (${cita.estado})`);
      });
    } else {
      console.error('❌ Error:', citasData.message);
    }

    console.log('\n✅ Prueba completada - Datos reales obtenidos exitosamente');

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

testAdminStats();
