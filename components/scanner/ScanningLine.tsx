import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ScanningLineProps {
  scannerActive: boolean;
  scanned: boolean;
  action?: string;
}

export default function ScanningLine({
  scannerActive,
  scanned,
  action,
}: ScanningLineProps) {
  const animationValue = useRef(new Animated.Value(0)).current;

  // Scanning line animation
  useEffect(() => {
    if (scannerActive && !scanned) {
      const runScanAnimation = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(animationValue, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: false,
              easing: Easing.linear,
            }),
            Animated.delay(100),
          ]),
          { resetBeforeIteration: true }
        ).start();
      };

      runScanAnimation();

      return () => {
        animationValue.stopAnimation();
      };
    } else {
      animationValue.setValue(0);
    }
  }, [scannerActive, scanned]);

  if (scanned || !scannerActive) {
    return null;
  }

  return (
    <View className="absolute inset-0">
      {/* Scanning Line - Full width, moves from top to bottom */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: '#8E1616',
          shadowColor: '#8E1616',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 6,
          top: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, height + 100], // Start above screen, end below screen
          }),
        }}
      />
    </View>
  );
}
