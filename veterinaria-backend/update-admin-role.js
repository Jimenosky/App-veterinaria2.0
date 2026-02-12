const { Client } = require('pg');

const NEON_CONNECTION = 'postgresql://neondb_owner:npg_24ygwNfLnoCU@ep-snowy-mouse-ai2qasyt-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function updateAdminRole() {
  const pgClient = new Client({ connectionString: NEON_CONNECTION });
  await pgClient.connect();
  
  console.log('\n🔧 Actualizando rol de admin@gmail.com...\n');
  
  await pgClient.query("UPDATE usuarios SET rol = 'admin' WHERE email = 'admin@gmail.com'");
  
  const result = await pgClient.query("SELECT id, nombre, email, rol FROM usuarios WHERE email = 'admin@gmail.com'");
  
  console.log('✅ Usuario actualizado:');
  console.log(`   Email: ${result.rows[0].email}`);
  console.log(`   Nombre: ${result.rows[0].nombre}`);
  console.log(`   Rol: ${result.rows[0].rol}`);
  console.log('');
  
  await pgClient.end();
}

updateAdminRole().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
