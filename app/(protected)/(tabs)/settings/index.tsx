import { useAuth } from '@/context/auth-context';
import React from 'react';
import { Text, View } from 'react-native';

export default function Setting() {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <View className="flex-1 bg-green-50">
      <Text
        className="text-3xl font-bold text-blue-900 mb-8"
        onPress={handleLogout}
      >
        Settings
      </Text>
    </View>
  );
}
