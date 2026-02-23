import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import React from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register' || segments[0] === 'welcome';
    const inAdminPanel = segments[0] === 'admin';

    console.log('\n=== _layout Navigation Debug ===');
    console.log('User:', user ? `${user.email} (${user.rol})` : 'null');
    console.log('Segments:', segments);
    console.log('inAuthGroup:', inAuthGroup);
    console.log('inAdminPanel:', inAdminPanel);
    console.log('================================\n');

    // Si no hay usuario y no está en pantallas de auth, ir a welcome
    if (!user && !inAuthGroup && !inAdminPanel) {
      console.log('➡️ Redirecting to welcome (no user)');
      router.replace('/welcome');
    } 
    // Si hay usuario y está en pantallas de auth, redirigir según rol
    else if (user && inAuthGroup) {
      if (user.rol === 'admin') {
        console.log('➡️ Redirecting admin to /admin');
        router.replace('/admin');
      } else {
        console.log('➡️ Redirecting client to /');
        router.replace('/');
      }
    }
    // Si no hay usuario pero está en admin panel, redirigir a welcome
    else if (!user && inAdminPanel) {
      console.log('➡️ Redirecting to welcome (admin panel without user)');
      router.replace('/welcome');
    }
  }, [user, segments, isLoading]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: 'Mi Perfil' }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
