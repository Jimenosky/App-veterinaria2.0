import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Mascota {
  id: number;
  nombre: string;
  tipo: string;
  raza?: string;
  edad?: number;
  peso?: number;
  color?: string;
  usuario_id: number;
  usuario_nombre?: string;
  usuario_email?: string;
  fecha_creacion: string;
}

export default function MascotasAdminView() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchMascotas();
    }
  }, [token]);

  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    setToken(storedToken);
  };

  const fetchMascotas = async () => {
    try {
      const response = await fetch('https://api-express-mysql-de-jime.onrender.com/api/v1/mascotas/admin/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setMascotas(data.data);
      }
    } catch (error) {
      console.error('Error al cargar mascotas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMascotas();
  };

  const getTipoIcon = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('perro')) return 'paw';
    if (tipoLower.includes('gato')) return 'paw';
    if (tipoLower.includes('ave') || tipoLower.includes('pájaro')) return 'egg';
    if (tipoLower.includes('pez')) return 'fish';
    return 'paw';
  };

  const getTipoColor = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('perro')) return ['#f59e0b', '#f97316'];
    if (tipoLower.includes('gato')) return ['#8b5cf6', '#a78bfa'];
    if (tipoLower.includes('ave')) return ['#38bdf8', '#0ea5e9'];
    if (tipoLower.includes('pez')) return ['#06b6d4', '#0891b2'];
    return ['#10b981', '#059669'];
  };

  const renderMascota = ({ item }: { item: Mascota }) => (
    <View style={styles.mascotaCardWrapper}>
      <LinearGradient
        colors={getTipoColor(item.tipo)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mascotaCard}
      >
        <View style={styles.mascotaHeader}>
          <Ionicons name={getTipoIcon(item.tipo) as any} size={40} color="#fff" />
          <View style={styles.mascotaInfo}>
            <Text style={styles.mascotaNombre}>{item.nombre}</Text>
            <Text style={styles.mascotaTipo}>{item.tipo}</Text>
          </View>
        </View>

        <View style={styles.mascotaDetails}>
          {item.raza && (
            <View style={styles.detailRow}>
              <Ionicons name="paw" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.detailText}>Raza: {item.raza}</Text>
            </View>
          )}
          {item.edad !== undefined && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.detailText}>Edad: {item.edad} {item.edad === 1 ? 'año' : 'años'}</Text>
            </View>
          )}
          {item.peso !== undefined && (
            <View style={styles.detailRow}>
              <Ionicons name="scale" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.detailText}>Peso: {item.peso} kg</Text>
            </View>
          )}
          {item.color && (
            <View style={styles.detailRow}>
              <Ionicons name="color-palette" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.detailText}>Color: {item.color}</Text>
            </View>
          )}
        </View>

        <View style={styles.ownerSection}>
          <View style={styles.ownerHeader}>
            <Ionicons name="person" size={18} color="rgba(255, 255, 255, 0.9)" />
            <Text style={styles.ownerTitle}>Dueño</Text>
          </View>
          <Text style={styles.ownerName}>{item.usuario_nombre || 'Desconocido'}</Text>
          {item.usuario_email && (
            <Text style={styles.ownerEmail}>{item.usuario_email}</Text>
          )}
          <Text style={styles.registrationDate}>
            Registrado: {new Date(item.fecha_creacion).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Cargando mascotas...</Text>
      </View>
    );
  }

  if (mascotas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={['#38bdf8', '#0ea5e9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emptyIconContainer}
        >
          <Ionicons name="paw" size={60} color="#fff" />
        </LinearGradient>
        <Text style={styles.emptyTitle}>No hay mascotas registradas</Text>
        <Text style={styles.emptyText}>
          Aún no hay usuarios que hayan registrado sus mascotas
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={mascotas}
      renderItem={renderMascota}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#7c3aed"
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#a1a1aa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#18181b',
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 24,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 20,
    backgroundColor: '#18181b',
  },
  mascotaCardWrapper: {
    marginBottom: 16,
  },
  mascotaCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  mascotaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mascotaInfo: {
    marginLeft: 16,
    flex: 1,
  },
  mascotaNombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  mascotaTipo: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  mascotaDetails: {
    gap: 8,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },
  ownerSection: {
    gap: 6,
  },
  ownerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ownerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ownerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  ownerEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  registrationDate: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
