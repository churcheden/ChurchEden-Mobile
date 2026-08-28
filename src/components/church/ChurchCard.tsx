import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { Church } from '../../types';
import { ChurchIconBadge } from './ChurchIconBadge';

interface ChurchCardProps {
  church: Church;
  onPress: (church: Church) => void;
}

export function ChurchCard({ church, onPress }: ChurchCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(church)}
      activeOpacity={0.78}
      accessibilityRole="button"
      accessibilityLabel={`Select ${church.name}, located in ${church.city || ''}, ${church.country || ''}`}
    >
      {/* Church Icon Badge */}
      <ChurchIconBadge
        type={church.iconType}
        bgColor={church.iconBgColor || '#07182F'}
        size={52}
      />

      {/* Info Column */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {church.name}
        </Text>

        <View style={styles.locationRow}>
          <MapPin size={13} color="#8A95A5" strokeWidth={2} />
          <Text style={styles.locationText} numberOfLines={1}>
            {church.city ? `${church.city}, ` : ''}{church.country || church.region || 'Ghana'}
          </Text>
        </View>
      </View>

      {/* Trailing Gold Chevron */}
      <View style={styles.chevronContainer}>
        <ChevronRight size={20} color="#C98A16" strokeWidth={2.2} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#07182F', // Deep Navy
    fontFamily: Platform.select({
      ios: 'Inter-Bold',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    }),
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#647082', // Muted Text
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
  chevronContainer: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChurchCard;
