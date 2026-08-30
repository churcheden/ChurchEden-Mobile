import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  LogOut,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import churchService from '../services/churchService';
import { ChurchIconBadge } from '../components/church/ChurchIconBadge';
import type { Church } from '../types';

export function PendingApprovalScreen() {
  const params = useLocalSearchParams<{ churchId?: string }>();
  const activeRequest = churchService.getActiveJoinRequest();
  const [church, setChurch] = useState<Church | null>(null);
  const [checking, setChecking] = useState(false);
  const [stillWaiting, setStillWaiting] = useState(false);

  const churchName = activeRequest?.churchName || church?.name || 'Grace Community Church';
  const estimatedTime =
    activeRequest?.estimatedApprovalTime || church?.estimatedApprovalTime || '1–3 business days';

  useEffect(() => {
    let mounted = true;
    const churchId = params.churchId || activeRequest?.churchId || '';
    if (!churchId) return;
    (async () => {
      const response = await churchService.getChurchById(churchId);
      if (mounted && response.success) setChurch(response.data);
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.churchId]);

  const handleCheckStatus = async () => {
    setChecking(true);
    setStillWaiting(false);
    try {
      const request = await churchService.checkJoinRequestStatus();
      if (!request) {
        router.replace('/find-church');
        return;
      }
      if (request.status === 'approved') {
        churchService.clearActiveJoinRequest();
        router.replace('/(tabs)');
        return;
      }
      if (request.status === 'rejected') {
        router.replace('/request-rejected');
        return;
      }
      setStillWaiting(true);
    } catch {
      setStillWaiting(true);
    } finally {
      setChecking(false);
    }
  };

  const handleChangeRequest = () => {
    churchService.clearActiveJoinRequest();
    router.replace('/find-church');
  };

  const handleSignOut = () => {
    churchService.clearActiveJoinRequest();
    router.replace('/welcome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      <View style={styles.container}>
        {/* Church Logo / Icon (fallback) */}
        {church?.imageUrl ? (
          <View style={styles.iconCircle}>
            <Image source={{ uri: church.imageUrl }} style={styles.churchLogo} resizeMode="cover" />
          </View>
        ) : (
          <ChurchIconBadge type={church?.iconType} bgColor={church?.iconBgColor ?? '#07182F'} size={80} />
        )}

        {/* Headings */}
        <Text style={styles.title}>Request sent.</Text>
        <Text style={styles.subtitle}>
          Your request to join <Text style={styles.churchHighlight}>{churchName}</Text> has been sent to the church administrators.
        </Text>
        <Text style={styles.instructionText}>
          You’ll receive an in-app and email notification when your membership request has been reviewed.
        </Text>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Request Status</Text>
            <View style={styles.statusBadge}>
              <Clock size={12} color="#B45309" strokeWidth={2.4} />
              <Text style={styles.statusBadgeText}>Pending approval</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <ShieldCheck size={16} color="#647082" />
            <Text style={styles.infoRowText}>{churchName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Clock size={16} color="#647082" />
            <Text style={styles.infoRowText}>Estimated review: {estimatedTime}</Text>
          </View>
        </View>

        {/* Informational Guidance Notice */}
        <View style={styles.guideCard}>
          <CheckCircle2 size={18} color="#166534" style={{ marginTop: 2 }} />
          <Text style={styles.guideText}>
            While waiting for approval, access to church groups, giving, and private member data is securely protected.
          </Text>
        </View>

        {/* "Still waiting" feedback (non-error) */}
        {stillWaiting && (
          <View style={styles.checkNotice}>
            <Clock size={16} color="#B45309" strokeWidth={2.4} />
            <Text style={styles.checkNoticeText}>
              Still waiting for approval — we’ll notify you here as soon as your request is reviewed.
            </Text>
          </View>
        )}

        <View style={{ flex: 1 }} />

        {/* Bottom Actions */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, checking && styles.primaryButtonDisabled]}
            onPress={handleCheckStatus}
            activeOpacity={0.85}
            disabled={checking}
            accessibilityRole="button"
            accessibilityLabel="Check Approval Status"
          >
            {checking ? (
              <ActivityIndicator size="small" color="#07182F" />
            ) : (
              <RefreshCw size={18} color="#07182F" strokeWidth={2.5} />
            )}
            <Text style={styles.primaryButtonText}>
              {checking ? 'Checking status...' : 'Check Approval Status'}
            </Text>
            {!checking && <ChevronRight size={18} color="#07182F" strokeWidth={2.5} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.changeButton}
            onPress={handleChangeRequest}
            activeOpacity={0.8}
          >
            <ArrowLeft size={16} color="#647082" />
            <Text style={styles.changeButtonText}>Select a Different Church</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
            <LogOut size={14} color="#8A95A5" strokeWidth={2.4} />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
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
    backgroundColor: '#FAF7F2',
    borderWidth: 2,
    borderColor: '#E8D5B5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#C98A16',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  churchLogo: {
    width: '100%',
    height: '100%',
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
    marginBottom: 10,
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
  instructionText: {
    fontSize: 13.5,
    color: '#647082',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#07182F',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1EBE1',
    marginVertical: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoRowText: {
    fontSize: 13.5,
    color: '#475569',
    fontWeight: '500',
  },
  guideCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    width: '100%',
  },
  guideText: {
    flex: 1,
    fontSize: 12.5,
    color: '#166534',
    lineHeight: 18,
  },
  checkNotice: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    width: '100%',
    marginTop: 12,
  },
  checkNoticeText: {
    flex: 1,
    fontSize: 12.5,
    color: '#92400E',
    lineHeight: 18,
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
  changeButton: {
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
  changeButtonText: {
    color: '#475569',
    fontSize: 14.5,
    fontWeight: '600',
  },
  signOutButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  signOutButtonText: {
    color: '#8A95A5',
    fontSize: 13.5,
    fontWeight: '600',
  },
});

export default PendingApprovalScreen;