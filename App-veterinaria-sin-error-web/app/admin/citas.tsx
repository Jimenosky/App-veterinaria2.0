import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

interface Cita {
  id: number;
  usuario_nombre: string;
  mascota_nombre: string;
  fecha: string;
  hora: string;
  tipo_servicio: string;
  descripcion?: string;
  estado: string;
}

export default function CitasScreen() {
  const { token } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCitas = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api-express-mysql-de-jime.onrender.com/api/v1/citas/admin/all', {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCitas(data.data);
      }
    } catch (error) {
      console.error('Error fetching citas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCitas();
  };

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b' };
      case 'confirmada':
        return { bg: 'rgba(56, 189, 248, 0.2)', text: '#38bdf8' };
      case 'completada':
        return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' };
      case 'cancelada':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' };
      default:
        return { bg: 'rgba(156, 163, 175, 0.2)', text: '#9ca3af' };
    }
  };

  const renderCita = ({ item }: { item: Cita }) => {
    const estadoStyle = getEstadoStyle(item.estado);

    return (
      <TouchableOpacity style={styles.citaCard}>
        <View style={styles.citaHeader}>
          <View>
            <Text style={styles.clienteNombre}>{item.usuario_nombre}</Text>
            <View style={styles.mascotaContainer}>
              <Ionicons name="paw" size={14} color="#9ca3af" />
              <Text style={styles.mascotaNombre}>{item.mascota_nombre}</Text>
            </View>
          </View>
          <View style={[styles.estadoBadge, { backgroundColor: estadoStyle.bg }]}>
            <Text style={[styles.estadoText, { color: estadoStyle.text }]}>
              {item.estado}
            </Text>
          </View>
        </View>

        <View style={styles.citaDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color="#9ca3af" />
            <Text style={styles.detailText}>{item.fecha}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color="#9ca3af" />
            <Text style={styles.detailText}>{item.hora}</Text>
          </View>
        </View>

        <View style={styles.motivoContainer}>
          <Text style={styles.motivoLabel}>Tipo de Servicio:</Text>
          <Text style={styles.motivoText}>{item.tipo_servicio}</Text>
          {item.descripcion && (
            <Text style={styles.descripcionText}>{item.descripcion}</Text>
          )}
        </View>

        <View style={styles.citaActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="create-outline" size={20} color="#7c3aed" />
            <Text style={styles.actionBtnText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
            <Text style={[styles.actionBtnText, { color: '#10b981' }]}>Completar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={citas}
        renderItem={renderCita}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#6b7280" />
            <Text style={styles.emptyText}>No hay citas programadas</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 16,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  citaCard: {
    backgroundColor: '#18181b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clienteNombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  mascotaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mascotaNombre: {
    fontSize: 14,
    color: '#9ca3af',
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  citaDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  motivoContainer: {
    marginBottom: 12,
  },
  motivoLabel: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 4,
  },
  motivoText: {
    color: '#ffffff',
    fontSize: 14,
  },
  descripcionText: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 4,
    fontStyle: 'italic',
  },
  citaActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    gap: 6,
  },
  actionBtnText: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    marginTop: 16,
  },
});
