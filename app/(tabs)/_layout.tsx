import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { MemberTheme } from '../../src/constants/memberTheme';
import {
  Home,
  Church,
  ScanLine,
  Wallet,
  Settings,
} from 'lucide-react-native';

function ScanButton({ color, size, focused }: { color: string; size: number; focused: boolean }) {
  return (
    <View style={styles.scanCenter} pointerEvents="box-none">
      <View
        style={[
          styles.scanRaised,
          focused && styles.scanRaisedFocused,
        ]}
      >
        <ScanLine size={30} color="#FFFFFF" strokeWidth={2.2} />
      </View>
    </View>
  );
}

export default function TabLayout() {
  const theme = MemberTheme;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size || 22} color={color} />,
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tabs.Screen
        name="my-church"
        options={{
          title: 'My Church',
          tabBarIcon: ({ color, size }) => <Church size={size || 22} color={color} />,
          tabBarAccessibilityLabel: 'My Church tab',
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Scan',
          tabBarIcon: (props) => <ScanButton {...props} />,
          tabBarLabel: '',
          tabBarAccessibilityLabel: 'QR Attendance Scan, opens the scanner',
        }}
      />
      <Tabs.Screen
        name="donations"
        options={{
          title: 'My Wallet',
          tabBarIcon: ({ color, size }) => <Wallet size={size || 22} color={color} />,
          tabBarAccessibilityLabel: 'My Wallet tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size || 22} color={color} />,
          tabBarAccessibilityLabel: 'Settings tab',
        }}
      />

      {/* Hidden routes (navigated to programmatically, not shown in the tab bar) */}
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          href: null,
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: 'Members',
          href: null,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    height: 66,
    paddingTop: 6,
    paddingBottom: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 12,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  scanCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanRaised: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: MemberTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: MemberTheme.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    marginTop: -16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  scanRaisedFocused: {
    backgroundColor: '#356A31',
  },
});
