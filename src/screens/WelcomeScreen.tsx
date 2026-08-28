import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ShieldCheck, Users, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { ChurchEdenLogo } from '../components/common/ChurchEdenLogo';

function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <Path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <Path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <Path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </Svg>
  );
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: <ShieldCheck size={22} color="#166534" strokeWidth={2} />,
    title: 'Secure & private',
    description: 'Your information is safe with us.',
  },
  {
    icon: <Users size={22} color="#166534" strokeWidth={2} />,
    title: 'Access your church',
    description: 'Connect with your church community.',
  },
  {
    icon: <Clock size={22} color="#166534" strokeWidth={2} />,
    title: 'Quick & easy',
    description: 'Join and get started in just a few steps.',
  },
];

export function WelcomeScreen() {
  // TODO: Replace with real Google Sign-In once backend auth is live.
  // For now, stub-navigate directly to the next screen in the flow so the
  // UI can be tested end-to-end without a backend dependency.
  const handleGoogleSignIn = () => {
    router.replace('/find-church');
  };

  // TODO: Replace with a real "Sign In" screen / auth flow once backend auth
  // is live. For now, stub-navigate forward so the flow can be tested.
  const handleSignIn = () => {
    router.replace('/find-church');
  };

  const handleTerms = () => {
    // TODO: Open Terms of Service screen/webview.
  };

  const handlePrivacy = () => {
    // TODO: Open Privacy Policy screen/webview.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top branding */}
        <View style={styles.branding}>
          <ChurchEdenLogo size={120} />
          <Text style={styles.wordmark}>ChurchEden</Text>
          <Text style={styles.tagline}>FAITH. PEOPLE. PURPOSE.</Text>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>Welcome to ChurchEden</Text>
        <Text style={styles.headlineSubtext}>Sign in or create your account to get started.</Text>

        {/* Primary auth action */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
        >
          <GoogleG />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* OR divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Feature highlights */}
        <View style={styles.featureList}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureRow}>
              <View style={styles.featureIconBadge}>{f.icon}</View>
              <View style={styles.featureTextCol}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDescription}>{f.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Legal text */}
        <Text style={styles.legalText}>
          By continuing, you agree to our{' '}
          <Text style={styles.legalLink} onPress={handleTerms}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={styles.legalLink} onPress={handlePrivacy}>
            Privacy Policy
          </Text>
          .
        </Text>

        {/* Sign in link */}
        <TouchableOpacity
          style={styles.signInRow}
          onPress={handleSignIn}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Text style={styles.signInPrefix}>Already have an account? </Text>
          <Text style={styles.signInLink}>Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  branding: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  wordmark: {
    fontSize: 34,
    color: '#07182F',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    fontWeight: '700',
    marginTop: 14,
    letterSpacing: 0.2,
  },
  tagline: {
    fontSize: 12,
    color: '#C98A16',
    fontFamily: Platform.select({ ios: 'Inter-SemiBold', android: 'sans-serif-medium', default: 'sans-serif' }),
    fontWeight: '600',
    marginTop: 10,
    letterSpacing: 4,
  },
  headline: {
    fontSize: 26,
    fontWeight: '700',
    color: '#07182F',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  headlineSubtext: {
    fontSize: 14,
    color: '#647082',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Platform.select({ ios: 'Inter-Regular', android: 'sans-serif', default: 'sans-serif' }),
    marginBottom: 24,
  },
  googleButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#07182F',
    fontFamily: Platform.select({ ios: 'Inter-SemiBold', android: 'sans-serif-medium', default: 'sans-serif' }),
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 26,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2D9C8',
  },
  dividerText: {
    fontSize: 12,
    color: '#8A95A5',
    marginHorizontal: 14,
    letterSpacing: 2,
    fontWeight: '600',
  },
  featureList: {
    gap: 20,
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#07182F',
    fontFamily: Platform.select({ ios: 'Inter-Bold', android: 'sans-serif-medium', default: 'sans-serif' }),
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13.5,
    color: '#647082',
    lineHeight: 19,
    fontFamily: Platform.select({ ios: 'Inter-Regular', android: 'sans-serif', default: 'sans-serif' }),
  },
  legalText: {
    fontSize: 12,
    color: '#8A95A5',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: Platform.select({ ios: 'Inter-Regular', android: 'sans-serif', default: 'sans-serif' }),
    marginBottom: 18,
  },
  legalLink: {
    color: '#C98A16',
    fontWeight: '700',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInPrefix: {
    fontSize: 14,
    color: '#647082',
    fontFamily: Platform.select({ ios: 'Inter-Regular', android: 'sans-serif', default: 'sans-serif' }),
  },
  signInLink: {
    fontSize: 14,
    color: '#C98A16',
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'Inter-Bold', android: 'sans-serif-medium', default: 'sans-serif' }),
  },
});

export default WelcomeScreen;
