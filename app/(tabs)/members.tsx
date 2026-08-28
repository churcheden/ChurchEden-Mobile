import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { Header } from '../../src/components/common/Header';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';
import { Member } from '../../src/types';
import { Search, Phone, Mail, Filter } from 'lucide-react-native';

const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    fullName: 'Grace Addo',
    email: 'grace.addo@churcheden.app',
    phone: '+233 24 555 0192',
    role: 'leader',
    campus: 'Main Grace Cathedral',
    profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    membershipDate: 'Member since 2021',
    status: 'active',
  },
  {
    id: '2',
    fullName: 'David Osei',
    email: 'david.osei@churcheden.app',
    phone: '+233 50 123 4567',
    role: 'pastor',
    campus: 'Main Grace Cathedral',
    profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    membershipDate: 'Member since 2018',
    status: 'active',
  },
  {
    id: '3',
    fullName: 'Sarah Mensah',
    email: 'sarah.m@churcheden.app',
    phone: '+233 20 888 9900',
    role: 'volunteer',
    campus: 'North Campus',
    profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    membershipDate: 'Member since 2022',
    status: 'active',
  },
  {
    id: '4',
    fullName: 'Emmanuel Kwame',
    email: 'emmanuel.k@churcheden.app',
    phone: '+233 27 444 3322',
    role: 'member',
    campus: 'Main Grace Cathedral',
    profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    membershipDate: 'Member since 2023',
    status: 'active',
  },
];

export default function MembersScreen() {
  const theme = Colors.dark;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'leader' | 'pastor' | 'volunteer' | 'member'>('all');

  const filteredMembers = MOCK_MEMBERS.filter((m) => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || m.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Members Directory" subtitle="Church Membership Registry" />
      
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}>
          <Search size={18} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search by member name or email..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {(['all', 'leader', 'pastor', 'volunteer', 'member'] as const).map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedRole === r ? theme.primary : theme.card,
                  borderColor: selectedRole === r ? theme.primary : theme.cardBorder,
                },
              ]}
              onPress={() => setSelectedRole(r)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: selectedRole === r ? '#FFFFFF' : theme.textSecondary },
                ]}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Member List */}
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <Card style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <Image source={{ uri: item.profileImageUrl }} style={styles.avatar} />
                <View style={styles.memberMeta}>
                  <Text style={[styles.memberName, { color: theme.textPrimary }]}>{item.fullName}</Text>
                  <Text style={[styles.memberCampus, { color: theme.textSecondary }]}>{item.campus}</Text>
                  <Text style={[styles.memberDate, { color: theme.textMuted }]}>{item.membershipDate}</Text>
                </View>
                <Badge
                  label={item.role.toUpperCase()}
                  type={item.role === 'pastor' ? 'danger' : item.role === 'leader' ? 'warning' : 'primary'}
                />
              </View>

              <View style={[styles.contactRow, { borderTopColor: theme.cardBorder }]}>
                <View style={styles.contactItem}>
                  <Phone size={14} color={theme.textSecondary} />
                  <Text style={[styles.contactText, { color: theme.textSecondary }]}>{item.phone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Mail size={14} color={theme.textSecondary} />
                  <Text style={[styles.contactText, { color: theme.textSecondary }]}>{item.email}</Text>
                </View>
              </View>
            </Card>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  listContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  memberCard: {
    gap: 12,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  memberMeta: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  memberCampus: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  memberDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});
