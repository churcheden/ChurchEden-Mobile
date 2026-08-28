import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Church } from '../../types';
import { MemberTheme } from '../../constants/memberTheme';
import { MapPin, Church as ChurchIcon } from 'lucide-react-native';

interface ChurchHeroCardProps {
  church: Church | null;
  onPress?: () => void;
}

export function ChurchHeroCard({ church, onPress }: ChurchHeroCardProps) {
  if (!church) return null;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${church.name}, your church community`}
    >
      <View style={styles.contentRow}>
        <View style={styles.logoContainer}>
          {church.imageUrl ? (
            <Image
              source={{ uri: church.imageUrl }}
              style={styles.logoImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.logoFallback}>
              <ChurchIcon size={24} color="#FFFFFF" strokeWidth={1.8} />
            </View>
          )}
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.churchName} numberOfLines={1}>
            {church.name}
          </Text>

          <View style={styles.locationRow}>
            <MapPin size={13} color={MemberTheme.textMuted} />
            <Text style={styles.locationText} numberOfLines={1}>
              {church.city && church.country
                ? `${church.city}, ${church.country}`
                : church.address || 'Ghana'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Your Church Community</Text>
            {church.memberCount ? (
              <>
                <Text style={styles.statusSeparator}>•</Text>
                <Text style={styles.memberCountText}>
                  {church.memberCount.toLocaleString()} members
                </Text>
              </>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    padding: 16,
    marginBottom: 16,
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoContainer: {
    width: 54,
    height: 54,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#10233F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#10233F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  churchName: {
    fontSize: 17,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12.5,
    color: MemberTheme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: MemberTheme.primary,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: MemberTheme.primary,
    fontFamily: 'Inter-SemiBold',
  },
  statusSeparator: {
    fontSize: 11,
    color: MemberTheme.textMuted,
    marginHorizontal: 6,
  },
  memberCountText: {
    fontSize: 11.5,
    color: MemberTheme.textMuted,
    fontFamily: 'Inter-Regular',
  },
});

export default ChurchHeroCard;
