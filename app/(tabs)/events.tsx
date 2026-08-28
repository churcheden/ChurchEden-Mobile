import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { Header } from '../../src/components/common/Header';
import { Card } from '../../src/components/common/Card';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { ChurchEvent } from '../../src/types';
import { Calendar, MapPin, Clock, Users2 } from 'lucide-react-native';

const MOCK_EVENTS: ChurchEvent[] = [
  {
    id: 'evt_1',
    title: 'Anointing & Breakthrough Service',
    description: 'Join Senior Pastor for a powerful time of communion, worship, and prophetical ministering.',
    location: 'Main Sanctuary - Grace Cathedral',
    startDate: 'Sun, Aug 31 • 9:00 AM',
    endDate: '12:00 PM',
    category: 'Sunday Service',
    isRSVPRequired: false,
    rsvpCount: 420,
  },
  {
    id: 'evt_2',
    title: 'Young Adults & Youth Fire Night',
    description: 'Special youth gathering with live worship band, interactive Q&A, and networking.',
    location: 'Youth Center Auditorium',
    startDate: 'Fri, Sep 5 • 6:30 PM',
    endDate: '9:00 PM',
    category: 'Youth',
    isRSVPRequired: true,
    rsvpCount: 185,
  },
  {
    id: 'evt_3',
    title: 'Kingdom Leadership Summit 2026',
    description: 'Equipping ministry leaders, department heads, and volunteers for extraordinary impact.',
    location: 'Conference Pavilion',
    startDate: 'Sat, Sep 13 • 8:30 AM',
    endDate: '4:00 PM',
    category: 'Conference',
    isRSVPRequired: true,
    rsvpCount: 310,
  },
];

export default function EventsScreen() {
  const theme = Colors.dark;
  const [rsvpedEvents, setRsvpedEvents] = useState<Record<string, boolean>>({});

  const toggleRSVP = (eventId: string, title: string) => {
    const nextState = !rsvpedEvents[eventId];
    setRsvpedEvents((prev) => ({ ...prev, [eventId]: nextState }));
    Alert.alert(
      nextState ? 'RSVP Confirmed' : 'RSVP Cancelled',
      nextState ? `You are registered for ${title}!` : `You cancelled your RSVP for ${title}.`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Church Events" subtitle="Upcoming Services & Conferences" />

      <FlatList
        data={MOCK_EVENTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isRSVPed = !!rsvpedEvents[item.id];
          return (
            <Card style={styles.eventCard}>
              <View style={styles.cardHeader}>
                <Badge label={item.category.toUpperCase()} type="primary" />
                <View style={styles.rsvpBadgeRow}>
                  <Users2 size={14} color={theme.textSecondary} />
                  <Text style={[styles.rsvpCountText, { color: theme.textSecondary }]}>
                    {item.rsvpCount + (isRSVPed ? 1 : 0)} Attending
                  </Text>
                </View>
              </View>

              <Text style={[styles.eventTitle, { color: theme.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.eventDesc, { color: theme.textSecondary }]}>{item.description}</Text>

              <View style={[styles.metaRow, { borderTopColor: theme.cardBorder }]}>
                <View style={styles.metaItem}>
                  <Calendar size={15} color={theme.secondary} />
                  <Text style={[styles.metaText, { color: theme.textPrimary }]}>{item.startDate}</Text>
                </View>

                <View style={styles.metaItem}>
                  <MapPin size={15} color={theme.primary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.location}</Text>
                </View>
              </View>

              <Button
                title={isRSVPed ? 'Cancel RSVP' : 'Reserve My Spot (RSVP)'}
                onPress={() => toggleRSVP(item.id, item.title)}
                variant={isRSVPed ? 'outline' : 'primary'}
                style={styles.rsvpBtn}
              />
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  eventCard: {
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rsvpBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rsvpCountText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    fontFamily: 'Inter-Bold',
  },
  eventDesc: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  metaRow: {
    gap: 8,
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  rsvpBtn: {
    marginTop: 6,
  },
});
