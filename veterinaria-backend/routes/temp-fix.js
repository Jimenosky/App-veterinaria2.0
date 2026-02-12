const express = require('express');
const { runQuery } = require('../config/database');

const router = express.Router();

// ENDPOINT TEMPORAL PARA ACTUALIZAR ROL A ADMIN
router.post('/fix-admin-role', async (req, res) => {
  try {
    await runQuery(
      "UPDATE usuarios SET rol = 'admin' WHERE email = 'admin@veterinaria.com'",
      []
    );

    res.json({
      success: true,
      message: 'Rol actualizado a admin para admin@veterinaria.com',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
