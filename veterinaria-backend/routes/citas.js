const express = require('express');
const { getQuery, runQuery, allQuery } = require('../config/database');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// OBTENER CITAS DEL USUARIO (Cliente)
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const citas = await allQuery(
      `SELECT c.*, m.nombre AS mascota_nombre, m.tipo AS mascota_tipo, u.nombre AS veterinario_nombre
       FROM citas c
       JOIN mascotas m ON c.mascota_id = m.id
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.usuario_id = ?
       ORDER BY c.fecha DESC, c.hora DESC`,
      [req.user.id]
    );

    res.json({ success: true, data: citas });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener citas' });
  }
});

// OBTENER TODAS LAS CITAS (Solo Admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const citas = await allQuery(
      `SELECT c.*, m.nombre AS mascota_nombre, m.tipo AS mascota_tipo, u.nombre AS usuario_nombre, u.email AS usuario_email, u.telefono
       FROM citas c
       JOIN mascotas m ON c.mascota_id = m.id
       JOIN usuarios u ON c.usuario_id = u.id
       ORDER BY c.fecha DESC, c.hora DESC`
    );

    res.json({ success: true, data: citas });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener citas' });
  }
});

// CREAR CITA (Cliente)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { mascota_id, fecha, hora, tipo_servicio, descripcion } = req.body;

    if (!mascota_id || !fecha || !hora || !tipo_servicio) {
      return res.status(400).json({
        success: false,
        message: 'mascota_id, fecha, hora y tipo_servicio son requeridos',
      });
    }

    // Verificar que la mascota pertenece al usuario
    const mascota = await getQuery('SELECT * FROM mascotas WHERE id = ? AND usuario_id = ?', [mascota_id, req.user.id]);
    if (!mascota) {
      return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
    }

    // Verificar que no haya cita en mismo horario
    const citaExistente = await getQuery(
      'SELECT * FROM citas WHERE fecha = ? AND hora = ? AND estado IN ("pendiente", "confirmada")',
      [fecha, hora]
    );
    if (citaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una cita en ese horario',
      });
    }

    const result = await runQuery(
      'INSERT INTO citas (usuario_id, mascota_id, fecha, hora, tipo_servicio, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, mascota_id, fecha, hora, tipo_servicio, descripcion || null]
    );

    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      data: {
        id: result.id,
        usuario_id: req.user.id,
        mascota_id,
        fecha,
        hora,
        tipo_servicio,
        descripcion,
        estado: 'pendiente',
      },
    });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ success: false, message: 'Error al crear cita' });
  }
});

// OBTENER CITA POR ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const cita = await getQuery(
      `SELECT c.*, m.nombre AS mascota_nombre, m.tipo AS mascota_tipo
       FROM citas c
       JOIN mascotas m ON c.mascota_id = m.id
       WHERE c.id = ?`,
      [req.params.id]
    );

    if (!cita) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }

    // Verificar que pertenece al usuario (a menos que sea admin)
    if (req.user.rol !== 'admin' && cita.usuario_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta cita' });
    }

    res.json({ success: true, data: cita });
  } catch (error) {
    console.error('Error al obtener cita:', error);
    res.status(500).json({ success: false, message: 'Error al obtener cita' });
  }
});

// ACTUALIZAR CITA (Cliente puede actualizar solo si está pendiente)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { fecha, hora, tipo_servicio, descripcion, estado, costo, notas_admin } = req.body;
    const citaId = req.params.id;

    const cita = await getQuery('SELECT * FROM citas WHERE id = ?', [citaId]);
    if (!cita) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }

    // Clientes solo pueden modificar citas pendientes y datos específicos
    if (req.user.rol !== 'admin') {
      if (cita.usuario_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'No tienes acceso a esta cita' });
      }
      if (cita.estado !== 'pendiente') {
        return res.status(400).json({
          success: false,
          message: 'Solo se pueden modificar citas pendientes',
        });
      }
    }

    const updateQuery = `
      UPDATE citas 
      SET fecha = ?, hora = ?, tipo_servicio = ?, descripcion = ?, 
          estado = ?, costo = ?, notas_admin = ? 
      WHERE id = ?
    `;

    await runQuery(updateQuery, [
      fecha || cita.fecha,
      hora || cita.hora,
      tipo_servicio || cita.tipo_servicio,
      descripcion !== undefined ? descripcion : cita.descripcion,
      estado || cita.estado,
      costo !== undefined ? costo : cita.costo,
      notas_admin || cita.notas_admin,
      citaId,
    ]);

    res.json({ success: true, message: 'Cita actualizada' });
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar cita' });
  }
});

// CANCELAR CITA (Cliente)
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const citaId = req.params.id;

    const cita = await getQuery('SELECT * FROM citas WHERE id = ?', [citaId]);
    if (!cita) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }

    // Verificar que pertenece al usuario
    if (cita.usuario_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta cita' });
    }

    // Solo se puede cancelar si no está completada
    if (cita.estado === 'completada') {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar una cita ya completada',
      });
    }

    await runQuery('UPDATE citas SET estado = ? WHERE id = ?', ['cancelada', citaId]);

    res.json({ success: true, message: 'Cita cancelada' });
  } catch (error) {
    console.error('Error al cancelar cita:', error);
    res.status(500).json({ success: false, message: 'Error al cancelar cita' });
  }
});

// ELIMINAR CITA (solo admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await runQuery('DELETE FROM citas WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Cita eliminada' });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar cita' });
  }
});

module.exports = router;
