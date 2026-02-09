const express = require('express');
const { getQuery, runQuery, allQuery } = require('../config/database');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// OBTENER TODAS LAS MASCOTAS DEL USUARIO
router.get('/', authenticateToken, async (req, res) => {
  try {
    const mascotas = await allQuery('SELECT * FROM mascotas WHERE usuario_id = ? ORDER BY fecha_creacion DESC', [
      req.user.id,
    ]);

    res.json({ success: true, data: mascotas });
  } catch (error) {
    console.error('Error al obtener mascotas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener mascotas' });
  }
});

// CREAR NUEVA MASCOTA
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, tipo, raza, edad, peso } = req.body;

    if (!nombre || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y tipo de mascota son requeridos',
      });
    }

    const result = await runQuery(
      'INSERT INTO mascotas (nombre, tipo, raza, edad, peso, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, tipo, raza || null, edad || null, peso || null, req.user.id]
    );

    res.status(201).json({
      success: true,
      message: 'Mascota creada exitosamente',
      data: { id: result.id, nombre, tipo, raza, edad, peso, usuario_id: req.user.id },
    });
  } catch (error) {
    console.error('Error al crear mascota:', error);
    res.status(500).json({ success: false, message: 'Error al crear mascota' });
  }
});

// OBTENER MASCOTA POR ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const mascota = await getQuery('SELECT * FROM mascotas WHERE id = ? AND usuario_id = ?', [req.params.id, req.user.id]);

    if (!mascota) {
      return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
    }

    res.json({ success: true, data: mascota });
  } catch (error) {
    console.error('Error al obtener mascota:', error);
    res.status(500).json({ success: false, message: 'Error al obtener mascota' });
  }
});

// ACTUALIZAR MASCOTA
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { nombre, tipo, raza, edad, peso } = req.body;
    const mascotaId = req.params.id;

    // Verificar que la mascota pertenece al usuario
    const mascota = await getQuery('SELECT * FROM mascotas WHERE id = ? AND usuario_id = ?', [mascotaId, req.user.id]);
    if (!mascota) {
      return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
    }

    const updateQuery = `
      UPDATE mascotas 
      SET nombre = ?, tipo = ?, raza = ?, edad = ?, peso = ? 
      WHERE id = ? AND usuario_id = ?
    `;

    await runQuery(updateQuery, [nombre || mascota.nombre, tipo || mascota.tipo, raza || mascota.raza, edad || mascota.edad, peso || mascota.peso, mascotaId, req.user.id]);

    res.json({
      success: true,
      message: 'Mascota actualizada',
      data: { id: mascotaId, nombre, tipo, raza, edad, peso },
    });
  } catch (error) {
    console.error('Error al actualizar mascota:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar mascota' });
  }
});

// ELIMINAR MASCOTA
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const mascotaId = req.params.id;

    // Verificar que la mascota pertenece al usuario
    const mascota = await getQuery('SELECT * FROM mascotas WHERE id = ? AND usuario_id = ?', [mascotaId, req.user.id]);
    if (!mascota) {
      return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
    }

    await runQuery('DELETE FROM mascotas WHERE id = ? AND usuario_id = ?', [mascotaId, req.user.id]);

    res.json({ success: true, message: 'Mascota eliminada' });
  } catch (error) {
    console.error('Error al eliminar mascota:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar mascota' });
  }
});

module.exports = router;
