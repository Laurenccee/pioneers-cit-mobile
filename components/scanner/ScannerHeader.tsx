import { router } from 'expo-router';
import { ArrowLeft, Flashlight, FlashlightOff } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Title from '../ui/title';

interface ScannerHeaderProps {
  title: string;
  flashOn: boolean;
  onToggleFlash: () => void;
}

export default function ScannerHeader({
  flashOn,
  onToggleFlash,
  title,
}: ScannerHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="px-5 py-4" style={{ paddingTop: insets.top + 20 }}>
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: 'rgba(30, 30, 30, 0.10)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 4,
          }}
          className="rounded-2xl p-3 border border-white/10"
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <Title className="text-white font-delight-bold text-lg">{title}</Title>
        <TouchableOpacity
          onPress={onToggleFlash}
          style={{
            backgroundColor: flashOn
              ? 'rgba(142, 22, 22, 0.8)'
              : 'rgba(30, 30, 30, 0.8)',
            shadowColor: flashOn ? '#8E1616' : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 4,
          }}
          className={`rounded-2xl p-3 border ${flashOn ? 'border-primary/30' : 'border-white/10'}`}
          activeOpacity={0.8}
        >
          {flashOn ? (
            <Flashlight size={20} color="#FFD700" />
          ) : (
            <FlashlightOff size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
