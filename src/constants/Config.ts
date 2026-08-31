import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};

export const Config = {
  env: (process.env.EXPO_PUBLIC_ENV || extra.environment || 'development') as 'development' | 'staging' | 'production',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || extra.apiUrl || 'https://api.churcheden.app/api/v1',
  bundleId: process.env.EXPO_PUBLIC_BUNDLE_ID || 'com.churcheden.app',
  packageName: process.env.EXPO_PUBLIC_PACKAGE_NAME || 'com.churcheden.app',
  
  // Payment Gateway Configuration
  paystackPublicKey: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || extra.paystackPublicKey || '',
  flutterwavePublicKey: process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || extra.flutterwavePublicKey || '',
  stripePublicKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || extra.stripePublicKey || '',
  momoPrimaryKey: process.env.EXPO_PUBLIC_MOMO_PRIMARY_KEY || '',

  // Feature Toggles
  enableQrScanner: process.env.EXPO_PUBLIC_ENABLE_QR_SCANNER !== 'false',
  enableLiveStream: process.env.EXPO_PUBLIC_ENABLE_LIVE_STREAM !== 'false',

  // Google OAuth
  googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
  googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',

  appVersion: Constants.expoConfig?.version || '1.0.0',
  buildNumber: Constants.expoConfig?.ios?.buildNumber || `${Constants.expoConfig?.android?.versionCode || 1}`
};

export default Config;
