import { Clock, Users } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import Paragraph from '../ui/paragraph';
import Title from '../ui/title';

interface StatCardProps {
  type: 'present' | 'late' | 'absent';
  count: number;
  label: string;
}

const getStatConfig = (type: StatCardProps['type']) => {
  switch (type) {
    case 'present':
      return {
        color: 'bg-primary/60',
        icon: Users,
        iconColor: 'white',
      };
    case 'late':
      return {
        color: 'bg-primary/40',
        icon: Clock,
        iconColor: 'white',
      };
    case 'absent':
      return {
        color: 'bg-primary',
        icon: Users,
        iconColor: 'white',
      };
    default:
      return {
        color: 'bg-primary/30',
        icon: Users,
        iconColor: 'white',
      };
  }
};

export const StatCard: React.FC<StatCardProps> = ({ type, count, label }) => {
  const config = getStatConfig(type);
  const IconComponent = config.icon;

  return (
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
        <View className="flex-row items-center justify-center mb-4">
          <View className="bg-primary/20 rounded-full p-3 border border-primary/40">
            <IconComponent color="white" size={20} />
          </View>
        </View>

        {/* Stats Content */}
        <View className="space-y-1 flex items-center">
          <Title className="text-3xl font-delight-black text-white leading-tight">
            {count}
          </Title>
          <Paragraph className="text-white/80 text-sm font-delight-medium tracking-wide">
            {label}
          </Paragraph>
        </View>
      </View>
    </View>
  );
};
