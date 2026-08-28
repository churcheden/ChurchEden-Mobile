import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { 
  LayoutDashboard, 
  Users, 
  QrCode, 
  HeartHandshake, 
  CalendarDays, 
  UserCheck, 
  Settings 
} from 'lucide-react-native';

export default function TabLayout() {
  const theme = Colors.dark;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.cardBorder,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily: 'Inter-SemiBold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: 'Members',
          tabBarIcon: ({ color, size }) => <Users size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, size }) => <QrCode size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="donations"
        options={{
          title: 'Giving',
          tabBarIcon: ({ color, size }) => <HeartHandshake size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => <CalendarDays size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color, size }) => <UserCheck size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size || 22} color={color} />,
        }}
      />
    </Tabs>
  );
}
