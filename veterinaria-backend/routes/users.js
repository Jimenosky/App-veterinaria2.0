const express = require('express');
const { allQuery } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// OBTENER TODOS LOS USUARIOS
router.get('/', authenticateToken, async (req, res) => {
  try {
    const usuarios = await allQuery('SELECT id, nombre, email, telefono, direccion, rol, fecha_creacion FROM usuarios ORDER BY fecha_creacion DESC', []);
    res.json({ success: true, data: usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
});

module.exports = router;
