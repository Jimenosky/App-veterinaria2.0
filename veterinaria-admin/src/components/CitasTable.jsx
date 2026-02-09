import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import './CitasTable.css';

export default function CitasTable({ onRefresh }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCita, setSelectedCita] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadCitas();
  }, []);

  const loadCitas = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/citas/admin/all');
      if (response.data.success) {
        setCitas(response.data.data);
      }
    } catch (error) {
      console.error('Error loading citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cita) => {
    setSelectedCita(cita);
    setEditData(cita);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCita(null);
  };

  const updateCita = async () => {
    try {
      const response = await apiClient.put(`/citas/${selectedCita.id}`, editData);
      if (response.data.success) {
        loadCitas();
        onRefresh?.();
        closeModal();
        alert('Cita actualizada');
      }
    } catch (error) {
      alert('Error al actualizar cita');
    }
  };

  const deleteCita = async (id) => {
    if (window.confirm('¿Eliminar esta cita?')) {
      try {
        await apiClient.delete(`/citas/${id}`);
        loadCitas();
        onRefresh?.();
        alert('Cita eliminada');
      } catch (error) {
        alert('Error al eliminar cita');
      }
    }
  };

  return (
    <div className="citas-container">
      <div className="citas-header">
        <h3>📅 Gestión de Citas</h3>
        <button className="refresh-btn" onClick={loadCitas}>
          🔄 Actualizar
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="table-responsive">
          <table className="citas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Mascota</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id}>
                  <td>#{cita.id}</td>
                  <td>
                    <strong>{cita.usuario_nombre}</strong>
                    <br />
                    <small>{cita.usuario_email}</small>
                  </td>
                  <td>{cita.mascota_nombre}</td>
                  <td>{cita.fecha}</td>
                  <td>{cita.hora}</td>
                  <td>{cita.tipo_servicio}</td>
                  <td>
                    <span className={`status-badge ${cita.estado}`}>{cita.estado}</span>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openModal(cita)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteCita(cita.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedCita && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h4>Editar Cita #{selectedCita.id}</h4>

            <div className="form-group">
              <label>Estado</label>
              <select
                value={editData.estado}
                onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div className="form-group">
              <label>Costo</label>
              <input
                type="number"
                value={editData.costo || ''}
                onChange={(e) => setEditData({ ...editData, costo: e.target.value })}
                placeholder="Ej: 50.00"
              />
            </div>

            <div className="form-group">
              <label>Notas del Admin</label>
              <textarea
                value={editData.notas_admin || ''}
                onChange={(e) => setEditData({ ...editData, notas_admin: e.target.value })}
                placeholder="Notas internas"
              />
            </div>

            <div className="modal-actions">
              <button className="btn-save" onClick={updateCita}>
                ✓ Guardar
              </button>
              <button className="btn-cancel" onClick={closeModal}>
                ✕ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
