import { ChevronRight, MapPin } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Paragraph from '../ui/paragraph';
import Title from '../ui/title';

interface UpcomingEventProps {
  title: string;
  date: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  icon?: React.ReactNode;
  isDone: boolean;
  location?: string;
}

export default function UpcommingEvent({
  title,
  date,
  description,
  startTime,
  endTime,
  icon,
  isDone,
  location,
}: UpcomingEventProps) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: isDone ? '#8E1616' : '#1E1E1E',
        shadowColor: isDone ? '#8E1616' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDone ? 0.3 : 0.2,
        shadowRadius: 8,
        elevation: 6,
      }}
      className="rounded-2xl overflow-hidden mx-1"
      activeOpacity={0.9}
    >
      {/* Status Indicator */}
      <View
        className={`h-1 w-full ${isDone ? 'bg-white/30' : 'bg-primary/60'}`}
      />

      <View className="flex-col gap-4 px-5 py-4">
        {/* Header Section */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            {location && (
              <View className="flex-row items-center gap-2 mb-2">
                <View className="bg-white/10 rounded-lg w-8 h-8 items-center justify-center">
                  <MapPin color="white" size={12} />
                </View>
                <Paragraph className="text-white/70 text-xs font-delight-light">
                  {location}
                </Paragraph>
              </View>
            )}
            <Title className="text-white text-xl font-delight-black leading-tight">
              {title}
            </Title>
            {description && (
              <Paragraph className="text-white/60 text-xs font-delight-light leading-relaxed mt-1">
                {description}
              </Paragraph>
            )}
          </View>

          <View className="bg-white/10 rounded-lg w-12 h-12 items-center justify-center ml-3">
            <Paragraph className="text-white/60 text-xs font-delight-medium uppercase leading-none">
              {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
            </Paragraph>
            <Title className="text-white text-sm font-delight-black leading-none">
              {new Date(date).getDate()}
            </Title>
          </View>
        </View>

        {/* Bottom Section */}
        <View className="flex-row items-center justify-between">
          <View className="bg-primary/15 rounded-lg px-3 py-2 border border-primary/25">
            <Paragraph className="text-primary text-sm font-delight-semibold">
              {startTime} - {endTime}
            </Paragraph>
          </View>

          <TouchableOpacity className="bg-primary/20 rounded-lg w-12 h-12 items-center justify-center border border-primary/30">
            <ChevronRight color="#8E1616" size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
