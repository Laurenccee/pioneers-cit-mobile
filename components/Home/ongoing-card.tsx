import { MapPin, SquareArrowOutUpRight } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Button from '../ui/button';
import Paragraph from '../ui/paragraph';
import Title from '../ui/title';

interface OngoingEventProps {
  label?: string;
  count?: number;
  outline?: boolean;
  isDone?: boolean;
  location?: string;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
}

export default function OngoingEvent({
  label,
  count,
  outline,
  isDone,
  location,
  title,
  description,
  startTime,
  endTime,
}: OngoingEventProps) {
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
              Oct
            </Paragraph>
            <Title className="text-white text-xl font-delight-black">15</Title>
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
          <Button className="flex-1 bg-white/15 border border-white/25">
            <SquareArrowOutUpRight color="#FFFFFF" size={14} />
            <Paragraph className="text-white text-sm font-delight-bold">
              CHECK IN
            </Paragraph>
          </Button>
          <Button className="flex-1 bg-primary border border-primary/50">
            <SquareArrowOutUpRight color="#FFFFFF" size={14} />
            <Paragraph className="text-white text-sm font-delight-bold">
              CHECK OUT
            </Paragraph>
          </Button>
        </View>
      </TouchableOpacity>
    </View>
  );
}
