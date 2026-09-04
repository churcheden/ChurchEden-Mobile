import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { tokenStore } from '../../src/lib/apiClient';

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{
    accessToken?: string;
    refreshToken?: string;
    profileComplete?: string;
    error?: string;
  }>();

  useEffect(() => {
    const accessToken = params.accessToken;
    const refreshToken = params.refreshToken;
    const profileComplete = params.profileComplete;
    const error = params.error;

    if (error) {
      router.replace('/welcome');
      return;
    }

    if (!accessToken || !refreshToken) {
      router.replace('/welcome');
      return;
    }

    (async () => {
      try {
        await tokenStore.setTokens(accessToken, refreshToken);
      } catch {
        // Fall through to welcome on storage failure
      }
      if (profileComplete === 'false') {
        router.replace('/find-church');
      } else {
        router.replace('/find-church');
      }
    })();
  }, [params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#C98A16" />
      <Text style={styles.text}>Completing sign-in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  text: {
    fontSize: 15,
    color: '#5B6470',
  },
});
