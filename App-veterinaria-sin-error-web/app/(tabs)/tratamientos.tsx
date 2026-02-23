import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TratamientosView() {
  // TODO: Implementar lógica de tratamientos desde backend

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={['#f59e0b', '#f97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.comingSoonCard}
      >
        <Text style={styles.emojiIcon}>💊</Text>
        <Text style={styles.comingSoonTitle}>Tratamientos</Text>
        <Text style={styles.comingSoonText}>
          Aquí podrás ver los tratamientos activos de tus mascotas:{'\n\n'}
          • Tratamientos continuos{'\n'}
          • Recetas médicas de consultas{'\n'}
          • Medicamentos y dosis{'\n'}
          • Próximas aplicaciones
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Próximamente</Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  comingSoonCard: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emojiIcon: {
    fontSize: 80,
  },
  comingSoonTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.95,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 24,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
