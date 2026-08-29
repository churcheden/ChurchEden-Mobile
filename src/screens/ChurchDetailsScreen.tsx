import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  Share,
  Modal,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  ChevronLeft,
  Share2,
  Heart,
  MapPin,
  Check,
  ChevronDown,
  ChevronUp,
  Users,
  Calendar,
  Clock,
  BookOpen,
  Music,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Church } from '../types';
import churchService from '../services/churchService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ChurchDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const churchId = params.id || 'church_1';

  const [church, setChurch] = useState<Church | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchChurch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await churchService.getChurchById(churchId);
      if (response.success && response.data) {
        setChurch(response.data);
        setIsFavorite(response.data.isFavorite || false);
      } else {
        setError(response.error || 'Unable to load church details.');
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [churchId]);

  useEffect(() => {
    fetchChurch();
  }, [fetchChurch]);

  const handleShare = async () => {
    if (!church) return;
    try {
      await Share.share({
        message: `Check out ${church.name} on ChurchEden: ${church.address || church.city || ''}`,
        title: church.name,
      });
    } catch (e) {
      // User dismissed share dialog
    }
  };

  const handleToggleFavorite = () => {
    if (!church) return;
    const newState = churchService.toggleFavorite(church.id);
    setIsFavorite(newState);
  };

  const handleConfirmJoin = async () => {
    if (!church) return;
    // Route through the "Complete Your Profile" step before submitting the
    // join request, so the church admin has the requester's details.
    setShowConfirmModal(false);
    router.push({
      pathname: '/complete-profile',
      params: { churchId: church.id },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C98A16" />
          <Text style={styles.loadingText}>Loading church details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !church) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <AlertCircle size={44} color="#EF4444" />
          <Text style={styles.errorTitle}>We couldn't load this church</Text>
          <Text style={styles.errorSubtitle}>{error || 'The requested church was not found.'}</Text>
          <View style={styles.errorButtonsRow}>
            <TouchableOpacity style={styles.backButtonOutline} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.retryButton} onPress={fetchChurch}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const activeRequest = churchService.getActiveJoinRequest();
  const isAlreadyRequested = activeRequest?.churchId === church.id && activeRequest?.status === 'pending';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      
      {/* Top Header Actions Row */}
      <View style={styles.topActionsRow}>
        <TouchableOpacity
          style={styles.circleActionButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={22} color="#07182F" strokeWidth={2.2} />
        </TouchableOpacity>

        <View style={styles.topRightActions}>
          <TouchableOpacity
            style={styles.circleActionButton}
            onPress={handleShare}
            activeOpacity={0.8}
            accessibilityLabel="Share church"
          >
            <Share2 size={19} color="#07182F" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleActionButton, isFavorite && styles.favoriteActiveButton]}
            onPress={handleToggleFavorite}
            activeOpacity={0.8}
            accessibilityLabel="Favorite church"
          >
            <Heart
              size={19}
              color={isFavorite ? '#EF4444' : '#07182F'}
              fill={isFavorite ? '#EF4444' : 'transparent'}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Church Hero Image with Registered Badge */}
        <View style={styles.imageCardContainer}>
          <Image
            source={{ uri: church.imageUrl || 'https://images.unsplash.com/photo-1508963493744-76fce69379c0?q=80&w=1200&auto=format&fit=crop' }}
            style={styles.heroImage}
            resizeMode="cover"
            accessibilityLabel={`${church.name} exterior photograph`}
          />
          {church.isRegistered && (
            <View style={styles.registeredBadge}>
              <Check size={14} color="#FFFFFF" strokeWidth={3} />
              <Text style={styles.registeredBadgeText}>Registered on ChurchEden</Text>
            </View>
          )}
        </View>

        {/* Church Name */}
        <Text style={styles.churchName}>{church.name}</Text>

        {/* Location Row */}
        <View style={styles.locationRow}>
          <MapPin size={15} color="#647082" strokeWidth={2} style={styles.locationPin} />
          <Text style={styles.locationText}>
            {church.city ? `${church.city}, ` : ''}
            {church.region ? `${church.region}, ` : ''}
            {church.country || 'Ghana'}
            {church.distance ? ` • ${church.distance}` : ''}
          </Text>
        </View>

        {/* Short Introduction with Read more */}
        {church.shortDescription && (
          <View style={styles.introContainer}>
            <Text
              style={styles.introText}
              numberOfLines={isExpanded ? undefined : 3}
            >
              {church.shortDescription}
            </Text>
            <TouchableOpacity
              style={styles.readMoreRow}
              onPress={() => setIsExpanded(!isExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.readMoreText}>
                {isExpanded ? 'Read less' : 'Read more'}
              </Text>
              {isExpanded ? (
                <ChevronUp size={15} color="#C98A16" strokeWidth={2.2} />
              ) : (
                <ChevronDown size={15} color="#C98A16" strokeWidth={2.2} />
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* 4-Column Statistics Card */}
        <View style={styles.statsCard}>
          {/* Column 1: Members */}
          <View style={styles.statCol}>
            <View style={styles.statIconBadge}>
              <Users size={16} color="#166534" strokeWidth={2} />
            </View>
            <Text style={styles.statLabel}>Members</Text>
            <Text style={styles.statValue}>
              {church.memberCount ? church.memberCount.toLocaleString() : '—'}
            </Text>
          </View>

          <View style={styles.statDivider} />

          {/* Column 2: Services */}
          <View style={styles.statCol}>
            <View style={styles.statIconBadge}>
              <Calendar size={16} color="#166534" strokeWidth={2} />
            </View>
            <Text style={styles.statLabel}>Services</Text>
            <Text style={styles.statValue}>{church.serviceCount ?? 1}</Text>
          </View>

          <View style={styles.statDivider} />

          {/* Column 3: Service Times */}
          <View style={styles.statCol}>
            <View style={styles.statIconBadge}>
              <Clock size={16} color="#166534" strokeWidth={2} />
            </View>
            <Text style={styles.statLabel}>Service Times</Text>
            <Text style={styles.statValueMultiLine} numberOfLines={2}>
              {church.serviceTimes && church.serviceTimes.length > 0
                ? `${church.serviceTimes[0]}${church.serviceTimes[1] ? `\n& ${church.serviceTimes[1].replace('Sun ', '')}` : ''}`
                : 'Sun 9:00 AM'}
            </Text>
          </View>

          <View style={styles.statDivider} />

          {/* Column 4: Founded */}
          <View style={styles.statCol}>
            <View style={styles.statIconBadge}>
              <Calendar size={16} color="#166534" strokeWidth={2} />
            </View>
            <Text style={styles.statLabel}>Founded</Text>
            <Text style={styles.statValue}>{church.foundedYear || 2012}</Text>
          </View>
        </View>

        {/* Section: What to expect */}
        {church.expectations && church.expectations.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>What to expect</Text>
            <View style={styles.expectationsWrap}>
              {church.expectations.map((item, idx) => {
                const renderExpectIcon = () => {
                  if (item.toLowerCase().includes('teaching') || item.toLowerCase().includes('bible')) {
                    return <BookOpen size={15} color="#166534" strokeWidth={2} />;
                  }
                  if (item.toLowerCase().includes('music') || item.toLowerCase().includes('worship')) {
                    return <Music size={15} color="#166534" strokeWidth={2} />;
                  }
                  if (item.toLowerCase().includes('children') || item.toLowerCase().includes('youth') || item.toLowerCase().includes('group')) {
                    return <HeartHandshake size={15} color="#166534" strokeWidth={2} />;
                  }
                  return <Users size={15} color="#166534" strokeWidth={2} />;
                };

                return (
                  <View key={idx} style={styles.expectationChip}>
                    {renderExpectIcon()}
                    <Text style={styles.expectationChipText}>{item}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Section: About the church */}
        {church.description && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>About the church</Text>
            <Text style={styles.descriptionText}>{church.description}</Text>
          </View>
        )}

        {/* Request Information Card */}
        <View style={styles.infoNoticeCard}>
          <View style={styles.shieldIconContainer}>
            <ShieldCheck size={24} color="#166534" strokeWidth={2} />
          </View>
          <View style={styles.infoNoticeContent}>
            <Text style={styles.infoNoticeTitle}>Request to Join</Text>
            <Text style={styles.infoNoticeBody}>
              Send a request to join {church.name}.
              {church.estimatedApprovalTime
                ? ` Approval may take up to ${church.estimatedApprovalTime.toLowerCase()}.`
                : ' Your request will be reviewed by church administrators.'}
            </Text>
          </View>
        </View>

        {/* Extra bottom padding to clear sticky CTA */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={styles.bottomBarContainer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            isAlreadyRequested && styles.pendingButton,
          ]}
          onPress={() => {
            if (isAlreadyRequested) {
              router.push({
                pathname: '/pending-approval',
                params: { churchId: church.id },
              });
            } else {
              setShowConfirmModal(true);
            }
          }}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={isAlreadyRequested ? 'Request Pending' : 'Request to Join'}
        >
          <Text style={styles.primaryButtonText}>
            {isAlreadyRequested ? 'Request Pending' : 'Request to Join'}
          </Text>
          <ArrowRight size={18} color="#07182F" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Confirmation Bottom Sheet / Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => !isSubmitting && setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderIcon}>
              <ShieldCheck size={32} color="#C98A16" strokeWidth={2} />
            </View>

            <Text style={styles.modalTitle}>Join {church.name}?</Text>
            <Text style={styles.modalDescription}>
              Your request will be sent to the church administrators for approval.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleConfirmJoin}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#07182F" />
                ) : (
                  <Text style={styles.modalConfirmText}>Request to Join</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F0E8', // Warm cream background
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    zIndex: 10,
  },
  circleActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  favoriteActiveButton: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
    backgroundColor: '#FFF5F5',
  },
  imageCardContainer: {
    width: '100%',
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    backgroundColor: '#E5E0D8',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  registeredBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(7, 24, 47, 0.82)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  registeredBadgeText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Inter-SemiBold',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    }),
  },
  churchName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#07182F', // Deep Navy
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 4,
  },
  locationPin: {
    marginRight: 2,
  },
  locationText: {
    fontSize: 13.5,
    color: '#647082',
    fontFamily: Platform.select({
      ios: 'Inter-Medium',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
    flex: 1,
  },
  introContainer: {
    marginBottom: 20,
  },
  introText: {
    fontSize: 14.5,
    color: '#475569',
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 3,
  },
  readMoreText: {
    fontSize: 13.5,
    color: '#C98A16', // Gold
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Inter-Bold',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    }),
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4', // Light green tint
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#647082',
    fontFamily: Platform.select({
      ios: 'Inter-Medium',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
    marginBottom: 2,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#07182F',
    fontFamily: Platform.select({
      ios: 'Inter-Bold',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    }),
    textAlign: 'center',
  },
  statValueMultiLine: {
    fontSize: 12,
    fontWeight: '700',
    color: '#07182F',
    textAlign: 'center',
    lineHeight: 15,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#EAE5DC',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#07182F',
    fontFamily: Platform.select({
      ios: 'Inter-Bold',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    }),
    marginBottom: 12,
  },
  expectationsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  expectationChip: {
    backgroundColor: '#F0FDF4', // Warm green pill
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  expectationChipText: {
    fontSize: 13,
    color: '#166534', // Dark green/olive text
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Inter-SemiBold',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    }),
  },
  descriptionText: {
    fontSize: 14.5,
    color: '#475569',
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
  infoNoticeCard: {
    backgroundColor: '#FAF7F2',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE7DB',
    marginBottom: 20,
    gap: 14,
  },
  shieldIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoNoticeContent: {
    flex: 1,
  },
  infoNoticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#07182F',
    marginBottom: 3,
  },
  infoNoticeBody: {
    fontSize: 12.5,
    color: '#647082',
    lineHeight: 18,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F5F0E8',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.select({ ios: 28, android: 20, default: 20 }),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
  primaryButton: {
    backgroundColor: '#C98A16', // ChurchEden Gold
    height: 56,
    borderRadius: 18,
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
  pendingButton: {
    backgroundColor: '#9A6700',
    opacity: 0.9,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#647082',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#07182F',
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#647082',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  backButtonOutline: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#475569',
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#C98A16',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 24, 47, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeaderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#E8D5B5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#07182F',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#647082',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    color: '#647082',
    fontSize: 14.5,
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1.2,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#C98A16',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    color: '#07182F',
    fontSize: 14.5,
    fontWeight: '700',
  },
});

export default ChurchDetailsScreen;
