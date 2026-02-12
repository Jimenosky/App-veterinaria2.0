const https = require('https');

const data = JSON.stringify({
  email: 'admin@veterinaria.com',
  password: 'password123'
});

const options = {
  hostname: 'api-express-mysql-de-jime.onrender.com',
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', JSON.parse(responseData));
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(data);
req.end();
