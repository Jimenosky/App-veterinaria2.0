import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  const [bgAnim] = useState(new Animated.Value(0));
  const [logoAnim] = useState(new Animated.Value(0));
  const [buttonsAnim] = useState(new Animated.Value(0));

  // Animación de fondo degradado
  useEffect(() => {
    Animated.loop(
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, [bgAnim]);

  // Animación de entrada del logo
  useEffect(() => {
    Animated.spring(logoAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  // Animación de entrada de botones
  useEffect(() => {
    setTimeout(() => {
      Animated.timing(buttonsAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    }, 300);
  }, []);

  const goToLogin = () => {
    router.push('/login');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  const callEmergency = () => {
    Linking.openURL('tel:555555555');
  };

  return (
    <Animated.View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
      <Animated.View
        style={[
          animatedBg,
          {
            opacity: bgAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
            backgroundColor: bgAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: ['#1a1a1a', '#4c1d95', '#1a1a1a'],
            }),
          },
        ]}
      />
      <LinearGradient
        colors={['#1a1a1acc', '#4c1d95cc', '#1a1a1acc']}
        style={styles.container}
      >
        {/* Huellitas decorativas en el fondo */}
        <Ionicons name="paw" size={80} color="rgba(255, 255, 255, 0.08)" style={styles.decorativePaw1} />
        <Ionicons name="paw" size={60} color="rgba(255, 255, 255, 0.06)" style={styles.decorativePaw2} />
        <Ionicons name="paw" size={100} color="rgba(255, 255, 255, 0.05)" style={styles.decorativePaw3} />
        <Ionicons name="paw" size={70} color="rgba(255, 255, 255, 0.07)" style={styles.decorativePaw4} />
        <Ionicons name="paw" size={50} color="rgba(255, 255, 255, 0.06)" style={styles.decorativePaw5} />
        <Ionicons name="paw" size={90} color="rgba(255, 255, 255, 0.05)" style={styles.decorativePaw6} />

        <View style={styles.content}>
          {/* Logo y título */}
          <Animated.View
            style={{
              opacity: logoAnim,
              transform: [
                {
                  scale: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                },
              ],
              alignItems: 'center',
              marginBottom: 60,
            }}
          >
            <View style={styles.logoCircle}>
              <Ionicons name="paw" size={120} color="#ffffff" />
            </View>
            <Text style={styles.appName}>
              VetNova
            </Text>
            <Text style={styles.tagline}>Tu veterinaria digital de confianza</Text>
          </Animated.View>

          {/* Botones */}
          <Animated.View
            style={{
              width: '100%',
              opacity: buttonsAnim,
              transform: [
                {
                  translateY: buttonsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            }}
          >
            <TouchableOpacity style={styles.buttonPrimary} onPress={goToLogin}>
              <LinearGradient
                colors={['#7c3aed', '#38bdf8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonTextPrimary}>Iniciar Sesión</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={goToRegister}>
              <Text style={styles.buttonTextSecondary}>Crear Cuenta</Text>
            </TouchableOpacity>

            {/* Número de emergencia */}
            <TouchableOpacity style={styles.emergencyContainer} onPress={callEmergency}>
              <Ionicons name="call" size={20} color="#ef4444" />
              <Text style={styles.emergencyText}>
                Emergencia: <Text style={styles.emergencyNumber}>555-555-555</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const animatedBg = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logoCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  appName: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 3,
    textShadowColor: '#7c3aed',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 15,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    color: '#cbd5e1',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonPrimary: {
    width: '100%',
    marginBottom: 15,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  buttonGradient: {
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonTextPrimary: {
    color: '#fafafa',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    textShadowColor: '#232526',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonSecondary: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 30,
  },
  buttonTextSecondary: {
    color: '#fafafa',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  emergencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    justifyContent: 'center',
  },
  emergencyText: {
    color: '#fafafa',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  emergencyNumber: {
    fontWeight: 'bold',
    color: '#ef4444',
    fontSize: 18,
  },
  decorativePaw1: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    transform: [{ rotate: '25deg' }],
  },
  decorativePaw2: {
    position: 'absolute',
    top: '25%',
    right: '15%',
    transform: [{ rotate: '-35deg' }],
  },
  decorativePaw3: {
    position: 'absolute',
    bottom: '20%',
    left: '8%',
    transform: [{ rotate: '45deg' }],
  },
  decorativePaw4: {
    position: 'absolute',
    bottom: '30%',
    right: '12%',
    transform: [{ rotate: '-20deg' }],
  },
  decorativePaw5: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    transform: [{ rotate: '60deg' }],
  },
  decorativePaw6: {
    position: 'absolute',
    top: '60%',
    right: '8%',
    transform: [{ rotate: '-50deg' }],
  },
});
