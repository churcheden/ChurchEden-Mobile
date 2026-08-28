import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLoadedAssets } from '../src/hooks/useLoadedAssets';
import { Colors } from '../src/constants/Colors';

const SPLASH_BACKGROUND = '#F5F0E8';

export default function RootLayout() {
  const isLoaded = useLoadedAssets();
  const theme = Colors.dark;

  if (!isLoaded) {
    return <View style={[styles.loadingContainer, { backgroundColor: SPLASH_BACKGROUND }]} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="light" backgroundColor={theme.tabBarBackground} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="find-church" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="church-details" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="pending-approval" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="complete-profile" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="request-church" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="payment-method" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="payment-flow" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="giving-history" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="coming-soon" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="events" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="event-details" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="announcements" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="announcement-details" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Church Info' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
