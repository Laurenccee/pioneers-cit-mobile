import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function ProtectedLayout() {
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
      {/* Tab Navigation */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      {/* Events Stack */}
      <Stack.Screen
        name="events"
        options={{
          headerShown: false,
        }}
      />

      {/* Full Screen Pages */}

      <Stack.Screen
        name="scanner"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}
