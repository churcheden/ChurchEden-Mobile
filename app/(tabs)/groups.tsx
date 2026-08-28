import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { Header } from '../../src/components/common/Header';
import { Card } from '../../src/components/common/Card';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { SmallGroup } from '../../src/types';
import { UserCheck, Clock, MapPin, Shield } from 'lucide-react-native';

const MOCK_GROUPS: SmallGroup[] = [
  {
    id: 'grp_1',
    name: 'Berean Bible Study Group',
    leaderName: 'Deacon Mark Lawson',
    meetingDay: 'Wednesdays',
    meetingTime: '7:00 PM',
    location: 'East Wing Room 204 & Online Zoom',
    category: 'Bible Study',
    memberCount: 24,
  },
  {
    id: 'grp_2',
    name: 'Men of Honor & Valor',
    leaderName: 'Elder Kwabena Frimpong',
    meetingDay: 'Saturdays (Bi-weekly)',
    meetingTime: '7:30 AM',
    location: 'Grace Fellowship Hall',
    category: 'Men',
    memberCount: 38,
  },
  {
    id: 'grp_3',
    name: 'Daughters of Zion Prayer Fellowship',
    leaderName: 'Pastor Mrs. Evelyn Eden',
    meetingDay: 'Tuesdays',
    meetingTime: '6:00 PM',
    location: 'Prayer Chapel',
    category: 'Women',
    memberCount: 45,
  },
  {
    id: 'grp_4',
    name: 'Kingdom Marriage & Couples Ministry',
    leaderName: 'Dr. & Mrs. Mensah',
    meetingDay: 'Sundays (Monthly)',
    meetingTime: '4:00 PM',
    location: 'Grace Cathedral Pavilion',
    category: 'Couples',
    memberCount: 30,
  },
];

export default function GroupsScreen() {
  const theme = Colors.dark;
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>({});

  const toggleJoinGroup = (groupId: string, name: string) => {
    const next = !joinedGroups[groupId];
    setJoinedGroups((prev) => ({ ...prev, [groupId]: next }));
    Alert.alert(
      next ? 'Joined Small Group' : 'Left Small Group',
      next ? `Welcome to ${name}! The group leader will reach out shortly.` : `You left ${name}.`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Small Groups" subtitle="Fellowship & Ministries" />

      <FlatList
        data={MOCK_GROUPS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isJoined = !!joinedGroups[item.id];
          return (
            <Card style={styles.groupCard}>
              <View style={styles.cardTop}>
                <Badge label={item.category.toUpperCase()} type="warning" />
                <View style={styles.membersCount}>
                  <UserCheck size={14} color={theme.textSecondary} />
                  <Text style={[styles.countText, { color: theme.textSecondary }]}>
                    {item.memberCount + (isJoined ? 1 : 0)} Members
                  </Text>
                </View>
              </View>

              <Text style={[styles.groupName, { color: theme.textPrimary }]}>{item.name}</Text>
              
              <View style={styles.leaderRow}>
                <Shield size={14} color={theme.secondary} />
                <Text style={[styles.leaderText, { color: theme.textSecondary }]}>
                  Led by {item.leaderName}
                </Text>
              </View>

              <View style={[styles.detailsBox, { backgroundColor: theme.background, borderColor: theme.cardBorder }]}>
                <View style={styles.detailItem}>
                  <Clock size={14} color={theme.primary} />
                  <Text style={[styles.detailText, { color: theme.textPrimary }]}>
                    {item.meetingDay} • {item.meetingTime}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <MapPin size={14} color={theme.accentSuccess} />
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                    {item.location}
                  </Text>
                </View>
              </View>

              <Button
                title={isJoined ? 'Joined (Click to Leave)' : 'Join Small Group'}
                onPress={() => toggleJoinGroup(item.id, item.name)}
                variant={isJoined ? 'outline' : 'primary'}
                style={styles.joinBtn}
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
  groupCard: {
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membersCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
    fontFamily: 'Inter-Bold',
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leaderText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  detailsBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  joinBtn: {
    marginTop: 4,
  },
});
