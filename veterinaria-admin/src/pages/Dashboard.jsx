import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import CitasTable from '../components/CitasTable';
import UsuariosTable from '../components/UsuariosTable';
import './Dashboard.css';

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('citas');
  const [stats, setStats] = useState({
    totalCitas: 0,
    totalUsuarios: 0,
    totalMascotas: 0,
    citasPendientes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [citasRes, usuariosRes] = await Promise.all([
        apiClient.get('/citas/admin/all'),
        apiClient.get('/auth/profile'),
      ]);

      let pendientes = 0;
      if (citasRes.data.success) {
        const citas = citasRes.data.data;
        pendientes = citas.filter((c) => c.estado === 'pendiente').length;
        setStats({
          totalCitas: citas.length,
          totalUsuarios: citas.length > 0 ? new Set(citas.map((c) => c.usuario_id)).size : 0,
          citasPendientes: pendientes,
          totalMascotas: 0,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>🏥 VetAdmin</h1>
          <p className="admin-name">{admin?.nombre || 'Administrador'}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'citas' ? 'active' : ''}`}
            onClick={() => setActiveTab('citas')}
          >
            📅 Citas
          </button>
          <button
            className={`nav-item ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('usuarios')}
          >
            👥 Usuarios
          </button>
          <button
            className={`nav-item ${activeTab === 'reportes' ? 'active' : ''}`}
            onClick={() => setActiveTab('reportes')}
          >
            📊 Reportes
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Cerrar Sesión
        </button>
      </div>

      <div className="main-content">
        <div className="dashboard-header">
          <h2>Dashboard Administrativo</h2>
          <p>Gestión del Sistema de Veterinaria</p>
        </div>

        {!loading && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Citas</h3>
              <p className="stat-number">{stats.totalCitas}</p>
            </div>
            <div className="stat-card">
              <h3>Citas Pendientes</h3>
              <p className="stat-number pending">{stats.citasPendientes}</p>
            </div>
            <div className="stat-card">
              <h3>Total Usuarios</h3>
              <p className="stat-number">{stats.totalUsuarios}</p>
            </div>
            <div className="stat-card">
              <h3>Total Mascotas</h3>
              <p className="stat-number">{stats.totalMascotas}</p>
            </div>
          </div>
        )}

        <div className="content-area">
          {activeTab === 'citas' && <CitasTable onRefresh={loadStats} />}
          {activeTab === 'usuarios' && <UsuariosTable />}
          {activeTab === 'reportes' && (
            <div className="section-placeholder">
              <p>📊 Sección de Reportes en desarrollo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
