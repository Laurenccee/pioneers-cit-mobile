import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 20,
  style,
  className,
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f3f4f6', '#e5e7eb'],
  });

  return (
    <Animated.View
      className={className}
      style={[
        {
          width: width as any,
          height: height as any,
          backgroundColor,
          borderRadius: 8,
        },
        style,
      ]}
    />
  );
}

// Card skeleton component
export function CardSkeleton() {
  return (
    <View className="bg-white rounded-2xl p-6 mb-4">
      <View className="flex-row items-center mb-4">
        <Skeleton width={40} height={40} className="rounded-full mr-3" />
        <View className="flex-1">
          <Skeleton width="60%" height={20} className="mb-2" />
          <Skeleton width="40%" height={16} />
        </View>
      </View>
      <Skeleton width="100%" height={16} className="mb-2" />
      <Skeleton width="80%" height={16} className="mb-4" />
      <View className="flex-row items-center">
        <Skeleton width={60} height={24} className="rounded-full mr-2" />
        <Skeleton width={80} height={24} className="rounded-full" />
      </View>
    </View>
  );
}

// Stat card skeleton component
export function StatCardSkeleton() {
  return (
    <View
      className="flex-1 rounded-3xl overflow-hidden"
      style={{
        backgroundColor: '#1E1E1E',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
      }}
    >
      <View className="p-5">
        <View className="flex-row items-center justify-center gap-4">
          {/* Icon skeleton */}
          <View className="bg-white/15 rounded-lg p-4">
            <Skeleton
              width={28}
              height={28}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            />
          </View>
          {/* Stats content skeleton */}
          <View className="space-y-1 flex items-center">
            <Skeleton
              width={40}
              height={40}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              className="mb-1"
            />
            <Skeleton
              width={50}
              height={12}
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
