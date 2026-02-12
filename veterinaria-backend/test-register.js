const https = require('https');

// Intentar crear admin directo
const options = {
  hostname: 'api-express-mysql-de-jime.onrender.com',
  path: '/api/v1/auth/create-admin-direct',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('🔧 Creando nuevo admin...\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const response = JSON.parse(responseData);
    console.log('Respuesta:', JSON.stringify(response, null, 2));
    
    if (response.success) {
      console.log('\n✅ NUEVO ADMIN CREADO');
      console.log('   Email:', response.email);
      console.log('   Password:', response.password);
      console.log('   Rol:', response.rol);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write('{}');
req.end();
