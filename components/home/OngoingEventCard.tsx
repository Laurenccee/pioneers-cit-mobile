import { router } from 'expo-router';
import {
  MapPin,
  SquareArrowOutDownLeft,
  SquareArrowOutUpRight,
} from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Button from '../ui/button';
import Paragraph from '../ui/paragraph';
import Title from '../ui/title';

interface OngoingEventProps {
  id?: string;
  label?: string;
  count?: number;
  outline?: boolean;
  isDone?: boolean;
  location?: string;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  date: string;
}

export default function OngoingEvent({
  id,
  label,
  count,
  outline,
  isDone,
  location,
  title,
  description,
  startTime,
  endTime,
  date,
}: OngoingEventProps) {
  const handleLogin = () => {
    if (id) {
      router.push(`/(protected)/scanner?eventId=${id}&action=login`);
    } else {
      console.warn('No event ID provided for scanner');
    }
  };

  const handleLogout = () => {
    if (id) {
      router.push(`/(protected)/scanner?eventId=${id}&action=logout`);
    } else {
      console.warn('No event ID provided for scanner');
    }
  };
  return (
    <View
      style={{
        backgroundColor: isDone ? '#8E1616' : '#1E1E1E',
        shadowColor: isDone ? '#8E1616' : '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: isDone ? 0.4 : 0.25,
        shadowRadius: 12,
        elevation: 10,
      }}
      className="flex flex-col rounded-3xl overflow-hidden mx-1"
    >
      {/* Status Indicator */}
      <View
        className={`h-1 w-full ${isDone ? 'bg-white/30' : 'bg-primary/60'}`}
      />
      <TouchableOpacity
        className="flex-col gap-5 px-6 py-6"
        activeOpacity={0.9}
      >
        {/* Header Section with Date and Location */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="bg-white/10 rounded-xl p-2 items-center justify-center">
                <MapPin color="white" size={14} />
              </View>
              <Paragraph className="text-white/80 text-sm font-delight-medium">
                {location}
              </Paragraph>
            </View>
            <Title className="text-white text-2xl font-delight-black leading-tight">
              {title}
            </Title>
          </View>

          <View className="bg-white/10 rounded-xl px-3 py-3 items-center min-w-[60px] ml-4">
            <Paragraph className="text-white/60 text-xs font-delight-medium uppercase">
              {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
            </Paragraph>
            <Title className="text-white text-xl font-delight-black">
              {new Date(date).getDate()}
            </Title>
          </View>
        </View>

        {/* Description and Time Section */}
        <View className="flex-col gap-3">
          <Paragraph className="text-white/70 text-sm font-delight-light leading-relaxed">
            {description}
          </Paragraph>

          <View className="flex-row items-center justify-between">
            <View className="bg-primary/15 rounded-lg px-3 py-2 border border-primary/25">
              <Paragraph className="text-primary text-sm font-delight-bold">
                {startTime} - {endTime}
              </Paragraph>
            </View>
            <View className="bg-white/5 rounded-lg px-3 py-2">
              <Paragraph className="text-white/60 text-xs font-delight-medium">
                Available
              </Paragraph>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <Button className="flex-1 bg-white/15  " onPress={handleLogin}>
            <SquareArrowOutDownLeft color="#FFFFFF" size={20} />
            <Paragraph className="text-white text-sm font-delight-bold">
              LOGIN
            </Paragraph>
          </Button>
          <Button
            className="flex-1 bg-primary border border-primary/50"
            onPress={handleLogout}
          >
            <SquareArrowOutUpRight color="#FFFFFF" size={20} />
            <Paragraph className="text-white text-sm font-delight-bold">
              LOGOUT
            </Paragraph>
          </Button>
        </View>
      </TouchableOpacity>
    </View>
  );
}
