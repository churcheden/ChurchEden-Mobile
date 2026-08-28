import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import { CHURCH_EDEN_LOGO_SRC } from '../components/common/ChurchEdenLogo';

// Prevent auto hiding splash screen until assets are loaded
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reload re-entrance guard */
});

export function useLoadedAssets() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Preload custom brand fonts and critical official logo image asset in parallel
        await Promise.all([
          Font.loadAsync({
            'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
            'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
            'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
          }),
          Asset.fromModule(CHURCH_EDEN_LOGO_SRC).downloadAsync(),
        ]);
      } catch (e) {
        // Fallback gracefully if fonts/assets fail to load locally
        console.warn('Asset loading notice:', e);
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
