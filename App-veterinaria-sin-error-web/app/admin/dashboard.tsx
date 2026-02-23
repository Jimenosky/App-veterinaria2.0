import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState({ usuarios: '--', citas: '--', pendientes: '--' });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      
      // Obtener usuarios
      const usersResponse = await fetch('https://api-express-mysql-de-jime.onrender.com/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        },
      });
      const usersData = await usersResponse.json();
      const totalUsuarios = usersData.success ? usersData.data.length : 0;
      
      // Obtener citas
      const citasResponse = await fetch('https://api-express-mysql-de-jime.onrender.com/api/v1/citas/admin/all', {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        },
      });
      const citasData = await citasResponse.json();
      
      if (citasData.success) {
        const totalCitas = citasData.data.length;
        const citasPendientes = citasData.data.filter((cita: any) => cita.estado === 'pendiente').length;
        
        setStats({
          usuarios: totalUsuarios.toString(),
          citas: totalCitas.toString(),
          pendientes: citasPendientes.toString(),
        });
      } else {
        setStats({
          usuarios: totalUsuarios.toString(),
          citas: '0',
          pendientes: '0',
        });
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setStats({ usuarios: '0', citas: '0', pendientes: '0' });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/welcome');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />
        }
      >
        {/* Bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Bienvenido, {user?.nombre} 👋</Text>
          <Text style={styles.roleText}>Administrador</Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#7c3aed', '#a78bfa']}
              style={styles.statGradient}
            >
              <Ionicons name="people" size={32} color="#ffffff" />
              <Text style={styles.statNumber}>{stats.usuarios}</Text>
              <Text style={styles.statLabel}>Usuarios</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#38bdf8', '#06b6d4']}
              style={styles.statGradient}
            >
              <Ionicons name="calendar" size={32} color="#ffffff" />
              <Text style={styles.statNumber}>{stats.citas}</Text>
              <Text style={styles.statLabel}>Citas Totales</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#f59e0b', '#f97316']}
              style={styles.statGradient}
            >
              <Ionicons name="time" size={32} color="#ffffff" />
              <Text style={styles.statNumber}>{stats.pendientes}</Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="person-add" size={24} color="#7c3aed" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Nuevo Usuario</Text>
              <Text style={styles.actionSubtitle}>Registrar nuevo cliente</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="calendar-outline" size={24} color="#38bdf8" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Nueva Cita</Text>
              <Text style={styles.actionSubtitle}>Agendar consulta</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="paw" size={24} color="#06b6d4" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Nueva Mascota</Text>
              <Text style={styles.actionSubtitle}>Registrar mascota</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    color: '#7c3aed',
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  statCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  actionsSection: {
    padding: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});
