import AppBar from '@/components/layouts/appbar';
import { Tabs, useSegments } from 'expo-router';
import { Calendar, Home, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const [tabBarVisible, setTabBarVisible] = useState(true);

  useEffect(() => {
    // Hide tab bar when navigating to full-screen pages
    const segmentString = segments.join('/');
    const isFullScreenPage =
      segmentString.includes('events/create') ||
      segmentString.includes('events/attendance') ||
      segmentString.includes('event-details');

    setTabBarVisible(!isFullScreenPage);
  }, [segments]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8E1616',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom + 5,
          paddingTop: 8,
          paddingHorizontal: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
          display: tabBarVisible ? 'flex' : 'none',
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        headerShown: true,
        header: () => (
          <AppBar
            title="SKIBIDII TESTING"
            showSearchButton={false}
            showNotificationButton={true}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <User size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
