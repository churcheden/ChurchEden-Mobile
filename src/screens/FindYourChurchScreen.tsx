import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Lock,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  X,
  Church as ChurchIcon,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Church } from '../types';
import churchService from '../services/churchService';
import { ChurchCard } from '../components/church/ChurchCard';
import { ChurchListSkeleton } from '../components/church/ChurchCardSkeleton';
import { tokenStore } from '../lib/apiClient';

export function FindYourChurchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [churches, setChurches] = useState<Church[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Auth guard: redirect to welcome if no access token exists
    const checkAuth = async () => {
      const token = await tokenStore.getAccess();
      if (!token) {
        router.replace('/welcome');
      }
    };
    checkAuth();
  }, []);

  const fetchChurches = useCallback(async (query = '') => {
    setError(null);
    try {
      const response = await churchService.searchChurches(query);
      if (response.success) {
        setChurches(response.data);
      } else {
        setError(response.error || 'Failed to load churches.');
      }
    } catch (err: any) {
      setError('Could not connect to the church directory. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchChurches(searchQuery);
  }, [searchQuery, fetchChurches]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchChurches(searchQuery);
  };

  const handleSelectChurch = (church: Church) => {
    router.push({
      pathname: '/church-details',
      params: { id: church.id },
    });
  };

  const handleRequestChurch = () => {
    router.push('/request-church');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#C98A16"
            colors={['#C98A16']}
          />
        }
      >
        {/* Top Header Badge & Titles */}
        <View style={styles.headerGroup}>
          <View style={styles.topIconCircle}>
            <ChurchIcon size={24} color="#C98A16" strokeWidth={2} />
          </View>

          <Text style={styles.mainTitle}>Find your church</Text>
          <Text style={styles.subtitle}>
            Search for your church below to get started{'\n'}or request to join.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#8A95A5" strokeWidth={2.2} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by church name, location..."
            placeholderTextColor="#8A95A5"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search by church name or location"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              accessibilityLabel="Clear search"
            >
              <X size={16} color="#8A95A5" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {}}
              accessibilityLabel="Filter churches"
            >
              <SlidersHorizontal size={18} color="#647082" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        {/* Section Row: Nearby Churches */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'Nearby Churches'}
          </Text>
          <View style={styles.locationIndicator}>
            <MapPin size={12} color="#C98A16" strokeWidth={2.2} />
            <Text style={styles.locationIndicatorText}>Accra, Ghana</Text>
          </View>
        </View>

        {/* Content Area: Loading / Error / Empty / List */}
        {isLoading ? (
          <ChurchListSkeleton count={5} />
        ) : error ? (
          <View style={styles.errorCard}>
            <AlertCircle size={36} color="#EF4444" strokeWidth={1.8} />
            <Text style={styles.errorTitle}>We couldn't load churches</Text>
            <Text style={styles.errorSubtitle}>
              Please check your internet connection and try again.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setIsLoading(true);
                fetchChurches(searchQuery);
              }}
              activeOpacity={0.8}
            >
              <RefreshCw size={15} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : churches.length === 0 ? (
          <View style={styles.emptyCard}>
            <ChurchIcon size={40} color="#C98A16" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Can't find your church?</Text>
            <Text style={styles.emptySubtitle}>
              No church matched "{searchQuery}". Your church may not be registered on ChurchEden yet.
            </Text>
            <TouchableOpacity
              style={styles.emptyActionButton}
              onPress={handleRequestChurch}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyActionButtonText}>Register your church</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {churches.map((church) => (
              <ChurchCard
                key={church.id}
                church={church}
                onPress={handleSelectChurch}
              />
            ))}
          </View>
        )}

        {/* Bottom Registration Card */}
        <View style={styles.bottomCard}>
          <View style={styles.bottomCardLeft}>
            <View style={styles.bottomChurchIcon}>
              <ChurchIcon size={22} color="#C98A16" strokeWidth={1.8} />
              <View style={styles.plusPill}>
                <Text style={styles.plusText}>+</Text>
              </View>
            </View>
            <View style={styles.bottomTextCol}>
              <Text style={styles.bottomCardTitle}>Can't find your church?</Text>
              <Text style={styles.bottomCardSubtitle}>
                Request to add your church to ChurchEden.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.requestButton}
            onPress={handleRequestChurch}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Request Church"
          >
            <Text style={styles.requestButtonText}>Request Church</Text>
          </TouchableOpacity>
        </View>

        {/* Secure Footer */}
        <View style={styles.footerRow}>
          <Lock size={13} color="#8A95A5" strokeWidth={2} />
          <Text style={styles.footerText}>Secure and private</Text>
        </View>
      </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerGroup: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  topIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#E8D5B5',
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#C98A16',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#07182F', // Deep Navy
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#647082', // Muted dark text
    textAlign: 'center',
    lineHeight: 21,
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#07182F',
    height: '100%',
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
  clearButton: {
    padding: 6,
  },
  filterButton: {
    padding: 6,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#07182F',
    fontFamily: Platform.select({
      ios: 'Inter-Bold',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    }),
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationIndicatorText: {
    fontSize: 13,
    color: '#647082',
    fontFamily: Platform.select({
      ios: 'Inter-Medium',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
  listContainer: {
    gap: 12,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 10,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  errorSubtitle: {
    fontSize: 13.5,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#C98A16',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#07182F',
    marginTop: 4,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: '#647082',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  emptyActionButton: {
    borderWidth: 1.5,
    borderColor: '#C98A16',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  emptyActionButtonText: {
    color: '#C98A16',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomCard: {
    backgroundColor: '#FAF7F2',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EFE7DB',
  },
  bottomCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  bottomChurchIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E8D5B5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 12,
  },
  plusPill: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#C98A16',
    borderRadius: 7,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 11,
  },
  bottomTextCol: {
    flex: 1,
  },
  bottomCardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#07182F',
    marginBottom: 2,
  },
  bottomCardSubtitle: {
    fontSize: 11.5,
    color: '#647082',
    lineHeight: 16,
  },
  requestButton: {
    backgroundColor: '#FAF7F2',
    borderWidth: 1.2,
    borderColor: '#C98A16',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  requestButtonText: {
    color: '#C98A16',
    fontSize: 12.5,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#8A95A5',
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
});

export default FindYourChurchScreen;
