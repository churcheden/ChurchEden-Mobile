/** @type {import('expo/config').ExpoConfig} */
module.exports = ({ config }) => {
  const env = process.env.EXPO_PUBLIC_ENV || 'development';
  const bundleId = process.env.EXPO_PUBLIC_BUNDLE_ID || 'com.churcheden.app';
  const packageName = process.env.EXPO_PUBLIC_PACKAGE_NAME || 'com.churcheden.app';
  
  const appName = env === 'production' 
    ? 'ChurchEden' 
    : env === 'staging' 
      ? 'ChurchEden (Staging)' 
      : 'ChurchEden (Dev)';

  return {
    ...config,
    name: appName,
    slug: 'churcheden-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/images/icon.png',
    scheme: 'churcheden',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      image: './src/assets/images/Just-logo-transparent.png',
      resizeMode: 'contain',
      backgroundColor: '#F5F0E8'
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleId,
      buildNumber: '1',
      infoPlist: {
        NSCameraUsageDescription: 'ChurchEden needs camera access to scan member QR codes for service attendance and check-in.',
        NSPhotoLibraryUsageDescription: 'ChurchEden requires access to your photo library to update profile pictures and upload event media.',
        NSMicrophoneUsageDescription: 'ChurchEden uses microphone access for audio recording during live service streaming if enabled.',
        NSLocationWhenInUseUsageDescription: 'ChurchEden uses your location to discover nearby church campuses and events.'
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/adaptive-icon.png',
        backgroundColor: '#0F172A'
      },
      package: packageName,
      versionCode: 1,
      permissions: [
        'CAMERA',
        'VIBRATE',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'INTERNET',
        'ACCESS_FINE_LOCATION'
      ]
    },
    web: {
      favicon: './src/assets/images/favicon.png',
      bundler: 'metro'
    },
    plugins: [
      'expo-router',
      [
        'expo-font',
        {
          fonts: [
            './src/assets/fonts/Inter-Regular.ttf',
            './src/assets/fonts/Inter-SemiBold.ttf',
            './src/assets/fonts/Inter-Bold.ttf'
          ]
        }
      ]
    ],
    extra: {
      eas: {
        projectId: '00000000-0000-0000-0000-000000000000'
      },
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      paystackPublicKey: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY,
      flutterwavePublicKey: process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
      stripePublicKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      environment: env
    }
  };
};
