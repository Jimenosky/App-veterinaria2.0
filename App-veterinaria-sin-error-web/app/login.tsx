import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'
  const [bounceAnim] = useState(new Animated.Value(0));
  const [buttonScale] = useState(new Animated.Value(1));
  const { login } = useAuth();

  // Animación de rebote para el ícono de pata
  useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    bounce.start();

    return () => {
      bounce.stop();
    };
  }, [bounceAnim]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('❌ Por favor ingresa email y contraseña');
      setMessageType('error');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('❌ El correo no tiene un formato válido');
      setMessageType('error');
      return;
    }

    // Validación de contraseña
    if (password.length < 6) {
      setMessage('❌ La contraseña debe tener al menos 6 caracteres');
      setMessageType('error');
      return;
    }

    animateButton();

    const success = await login(email, password);
    if (success) {
      setMessage('¡Inicio de sesión exitoso!');
      setMessageType('success');
      setTimeout(() => {
        router.replace('/');
      }, 800);
    } else {
      setMessage('❌ Credenciales incorrectas');
      setMessageType('error');
    }

    // Limpiar mensaje después de 3.5s
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3500);
  };

  return (
    <LinearGradient
      colors={['#ecfdf5', '#ccfbf1', '#a7f3d0']} // emerald-50, teal-50, lime-50
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Animated.View style={[styles.iconWrapper, { transform: [{ translateY: bounceAnim }] }]}>
              <Ionicons name="paw" size={40} color="#10b981" />
              <View style={styles.hospitalIcon}>
                <Ionicons name="medical" size={20} color="#065f46" />
              </View>
            </Animated.View>
            <Text style={styles.title}>Sistema Veterinario</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text: string) => setEmail(text.toLowerCase())}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={(text: string) => setPassword(text.trim())}
                secureTextEntry={!showPassword}
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </Animated.View>

            {message ? (
              <View style={[styles.messageContainer, messageType === 'success' ? styles.successMessage : styles.errorMessage]}>
                <Text style={[styles.messageText, messageType === 'success' ? styles.successText : styles.errorText]}>{message}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  hospitalIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#065f46', // emerald-800
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f9fafb',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#111827',
  },
  eyeIcon: {
    padding: 5,
  },
  button: {
    backgroundColor: '#10b981', // emerald-500
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  messageContainer: {
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  successMessage: {
    backgroundColor: '#d1fae5', // emerald-100
    borderColor: '#10b981',
    borderWidth: 1,
  },
  errorMessage: {
    backgroundColor: '#fee2e2', // red-100
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  successText: {
    color: '#065f46', // emerald-800
  },
  errorText: {
    color: '#dc2626', // red-600
  },
});