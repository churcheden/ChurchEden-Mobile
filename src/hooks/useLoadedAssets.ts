import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Prevent auto hiding splash screen until assets are loaded
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reload re-entrance guard */
});

export function useLoadedAssets() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load custom brand fonts
        await Font.loadAsync({
          'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
          'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
          'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        });
      } catch (e) {
        // Fallback gracefully if fonts fail to load locally
        console.warn('Font loading notice:', e);
      } finally {
        setLoadingComplete(true);
        await SplashScreen.hideAsync().catch(() => {});
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}

export default useLoadedAssets;
