import { ScrollView, StyleSheet, View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/user-menu';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#fff' : '#333';
  const bgColor = isDark ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDark ? '#2a2a2a' : '#fff';

  const quickActions = [
    { id: 1, title: 'Sacar Cita', icon: '📅', action: () => router.push('/(tabs)/explore') },
    { id: 2, title: 'Mis Mascotas', icon: '🐾', action: () => router.push('/(tabs)/explore') },
    { id: 3, title: 'Mi Perfil', icon: '👤', action: () => router.push('/profile') },
    { id: 4, title: 'Historial', icon: '📋', action: () => router.push('/(tabs)/explore') },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.welcomeTitle, { color: textColor }]}>
          Hola, {user?.nombre}! 👋
        </Text>
        <Text style={[styles.welcomeSubtitle, { color: isDark ? '#aaa' : '#666' }]}>
          Bienvenido al Sistema de Veterinaria
        </Text>
      </View>

      <View style={styles.content}>
        <UserMenu collapsed={false} />

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Acciones Rápidas</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, { backgroundColor: isDark ? '#333' : '#f9f9f9' }]}
                onPress={action.action}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={[styles.actionText, { color: textColor }]}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Información</Text>
          <View style={styles.infoBox}>
            <Text style={[styles.infoLabel, { color: isDark ? '#aaa' : '#666' }]}>Email</Text>
            <Text style={[styles.infoValue, { color: textColor }]}>{user?.email}</Text>
          </View>
          {user?.telefono && (
            <View style={styles.infoBox}>
              <Text style={[styles.infoLabel, { color: isDark ? '#aaa' : '#666' }]}>
                Teléfono
              </Text>
              <Text style={[styles.infoValue, { color: textColor }]}>{user.telefono}</Text>
            </View>
          )}
          <View style={styles.infoBox}>
            <Text style={[styles.infoLabel, { color: isDark ? '#aaa' : '#666' }]}>Tipo</Text>
            <Text style={[styles.infoValue, { color: textColor }]}>
              {user?.rol === 'admin' ? '🔑 Administrador' : '👤 Cliente'}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: '#f0f8ff' }]}>
          <Text style={[styles.sectionTitle, { color: '#1e40af' }]}>💡 Consejos</Text>
          <Text style={[styles.tipsText, { color: '#1e40af' }]}>
            • Recuerda agendar citas regulares para tus mascotas{'\n'}
            • Mantén tu perfil actualizado con la información más reciente{'\n'}
            • Revisa el estado de tus citas en la sección "Explora"
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  infoBox: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
