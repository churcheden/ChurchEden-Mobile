import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { ChurchEvent } from '../../types';
import { MemberTheme } from '../../constants/memberTheme';
import { Clock, MapPin } from 'lucide-react-native';

interface EventCarouselProps {
  events: ChurchEvent[];
  onPressEvent?: (event: ChurchEvent) => void;
}

const CARD_WIDTH = 272;
const CARD_MARGIN = 12;
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1200&auto=format&fit=crop';

interface DateParts {
  month: string;
  day: string;
  time: string;
}

function splitDate(startDate: string): DateParts {
  const date = new Date(startDate);
  if (isNaN(date.getTime())) {
    return { month: '—', day: '—', time: '' };
  }
  const month = date
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();
  const day = String(date.getDate());
  const time = date
    .toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toUpperCase();
  return { month, day, time };
}

export function EventCarousel({ events, onPressEvent }: EventCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<ChurchEvent>>(null);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CARD_WIDTH + CARD_MARGIN));
    setActiveIndex(Math.max(0, Math.min(index, events.length - 1)));
  };

  const renderItem = ({ item }: { item: ChurchEvent }) => {
    const { month, day, time } = splitDate(item.startDate);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => onPressEvent?.(item)}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${month} ${day} at ${time}`}
        accessibilityHint="Opens event details"
      >
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: item.bannerImageUrl || DEFAULT_IMAGE }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.dateBadge}>
            <Text style={styles.dateMonth}>{month}</Text>
            <Text style={styles.dateDay}>{day}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.metaRow}>
            <Clock size={14} color={MemberTheme.textMuted} />
            <Text style={styles.metaText}>{time}</Text>
          </View>
          <View style={styles.metaRow}>
            <MapPin size={14} color={MemberTheme.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <View>
      <FlatList
        ref={listRef}
        data={events}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={renderItem}
        accessibilityLabel="Upcoming events carousel"
      />

      {events.length > 1 && (
        <View style={styles.indicatorRow} accessibilityRole="adjustable">
          {events.map((_, index) => (
            <View
              key={`dot_${index}`}
              style={[
                styles.dot,
                index === activeIndex
                  ? styles.dotActive
                  : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 0,
    paddingRight: 0,
    paddingBottom: 4,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: CARD_MARGIN,
    backgroundColor: MemberTheme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MemberTheme.surfaceBorder,
    overflow: 'hidden',
    shadowColor: MemberTheme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 128,
    backgroundColor: MemberTheme.skeleton,
  },
  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: MemberTheme.primary,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: {
    color: MemberTheme.textOnDark,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'Inter-Bold',
  },
  dateDay: {
    color: MemberTheme.textOnDark,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: MemberTheme.textPrimary,
    fontFamily: 'Inter-Bold',
    height: 40,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: MemberTheme.textSecondary,
    flexShrink: 1,
    fontFamily: 'Inter-Regular',
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingBottom: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: MemberTheme.primary,
    width: 18,
  },
  dotInactive: {
    backgroundColor: '#D9D4C9',
  },
});

export default EventCarousel;
