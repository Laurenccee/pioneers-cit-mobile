import { LogIn, LogOut } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Paragraph from '../ui/paragraph';
import Title from '../ui/title';

interface StatCardProps {
  type: 'in' | 'out';
  count: number;
  label: string;
  onPress?: () => void;
}

const getStatConfig = (type: StatCardProps['type']) => {
  switch (type) {
    case 'in':
      return {
        color: 'bg-primary/30',
        icon: LogIn,
        iconColor: 'white',
      };
    case 'out':
      return {
        color: 'bg-primary/30',
        icon: LogOut,
        iconColor: 'white',
      };
    default:
      return {
        color: 'bg-primary/30',
        icon: LogIn,
        iconColor: 'white',
      };
  }
};

export default function StatCard({
  type,
  count,
  label,
  onPress,
}: StatCardProps) {
  const config = getStatConfig(type);
  const IconComponent = config.icon;

  const content = (
    <View
      style={{
        backgroundColor: '#1E1E1E',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
      }}
      className="flex-1 rounded-3xl overflow-hidden"
    >
      {/* Content Container */}
      <View className="p-5">
        {/* Header with Icon */}
        <View className="flex-row items-center justify-center gap-4">
          <View className={`${config.color} rounded-lg p-4 bg-white/15`}>
            <IconComponent color={config.iconColor} size={28} />
          </View>
          {/* Stats Content */}
          <View className="space-y-1 flex items-center">
            <Title className="text-4xl font-delight-black text-white leading-tight">
              {count}
            </Title>
            <Paragraph className="text-white/85 text-xs font-delight-bold tracking-wide">
              {label}
            </Paragraph>
          </View>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="flex-1"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}
