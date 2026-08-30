import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { XCircle, MessageSquareX, RefreshCw, ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import churchService from '../services/churchService';

export function RequestRejectedScreen() {
  const params = useLocalSearchParams<{ churchId?: string }>();
  const activeRequest = churchService.getActiveJoinRequest();
  const [requestingAgain, setRequestingAgain] = useState(false);

  const churchId = params.churchId || activeRequest?.churchId || '';
  const churchName = activeRequest?.churchName || 'your church';
  const rejectionReason = activeRequest?.rejectionReason;

  const handleRequestAgain = async () => {
    setRequestingAgain(true);
    try {
      const response = await churchService.requestToJoinChurch(churchId);
      if (response.success) {
        // Request is reset to PENDING; go back to the Awaiting Approval screen.
        router.replace({ pathname: '/pending-approval', params: { churchId } });
      } else {
        alert(response.error || 'Could not resubmit your request. Please try again.');
      }
    } catch {
      alert('Network error while submitting your request. Please try again.');
    } finally {
      setRequestingAgain(false);
    }
  };

  const handleChooseDifferentChurch = () => {
    churchService.clearActiveJoinRequest();
    router.replace('/find-church');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      <View style={styles.container}>
        {/* Result Icon */}
        <View style={styles.iconCircle}>
          <XCircle size={38} color="#B3261E" strokeWidth={2} />
        </View>

        {/* Headings */}
        <Text style={styles.title}>Request rejected</Text>
        <Text style={styles.subtitle}>
          Your request to join{' '}
          <Text style={styles.churchHighlight}>{churchName}</Text> was declined by the church
          administrator.
        </Text>

        {/* Reason from the church */}
        <View style={styles.reasonCard}>
          <View style={styles.reasonHeader}>
            <MessageSquareX size={16} color="#B3261E" strokeWidth={2.4} />
            <Text style={styles.reasonLabel}>Reason from the church</Text>
          </View>
          <Text style={styles.reasonText}>
            {rejectionReason ? rejectionReason : 'No reason was given, but you are welcome to reach out to the church directly.'}
          </Text>
        </View>

        {/* Guidance */}
        <View style={styles.hintCard}>
          <Text style={styles.hintText}>
            A rejected request doesn’t affect your profile. You can request to join the same church
            again or explore other churches.
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* Bottom Actions */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, requestingAgain && styles.primaryButtonDisabled]}
            onPress={handleRequestAgain}
            activeOpacity={0.85}
            disabled={requestingAgain}
            accessibilityRole="button"
            accessibilityLabel="Request Again"
          >
            {requestingAgain ? (
              <ActivityIndicator size="small" color="#07182F" />
            ) : (
              <RefreshCw size={18} color="#07182F" strokeWidth={2.5} />
            )}
            <Text style={styles.primaryButtonText}>
              {requestingAgain ? 'Submitting...' : 'Request Again'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleChooseDifferentChurch}
            activeOpacity={0.8}
          >
            <ArrowLeft size={16} color="#647082" />
            <Text style={styles.secondaryButtonText}>Choose a Different Church</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F0E8', // Warm cream
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FDF1F0',
    borderWidth: 2,
    borderColor: '#FCE3DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#B3261E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#07182F',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 28,
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
  churchHighlight: {
    fontWeight: '700',
    color: '#07182F',
  },
  reasonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
    gap: 8,
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#07182F',
  },
  reasonText: {
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 20,
  },
  hintCard: {
    backgroundColor: '#FAF7F2',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1EAE0',
    width: '100%',
  },
  hintText: {
    fontSize: 12.5,
    color: '#647082',
    lineHeight: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#C98A16', // ChurchEden Gold
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#C98A16',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#07182F', // Deep Navy text for crisp contrast on gold
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Inter-Bold',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    }),
  },
  secondaryButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 14.5,
    fontWeight: '600',
  },
});

export default RequestRejectedScreen;