import AppBar from '@/components/layouts/appbar';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function EventsLayout() {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen
        name="create"
        options={{
          headerShown: true,
          animation: 'slide_from_right',
          header: () => (
            <AppBar
              title="Create Event"
              variant="default"
              showMenuButton={false}
              showSearchButton={false}
              showNotificationButton={false}
              showBackButton={true}
              onBackPress={handleBackPress}
            />
          ),
        }}
      />

      <Stack.Screen
        name="attendance"
        options={{
          headerShown: true,
          animation: 'slide_from_right',
          header: () => (
            <AppBar
              title="Attendance List"
              variant="default"
              showMenuButton={false}
              showSearchButton={false}
              showNotificationButton={false}
              showBackButton={true}
              onBackPress={handleBackPress}
            />
          ),
        }}
      />
    </Stack>
  );
}
