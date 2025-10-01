import {
  ArrowLeft,
  Bell,
  Menu,
  MoreVertical,
  Search,
} from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Title from '../ui/title';

interface AppBarProps {
  title?: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  showSearchButton?: boolean;
  showNotificationButton?: boolean;
  showOptionsButton?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onOptionsPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  variant?: 'default' | 'simple';
}

// Convenience functions for common usage patterns
export const SimpleHeader = (props: Omit<AppBarProps, 'variant'>) => (
  <AppBar {...props} variant="simple" showBackButton={true} />
);

export const CustomHeader = (props: Omit<AppBarProps, 'variant'>) => (
  <AppBar {...props} variant="default" showMenuButton={true} />
);

export default function AppBar({
  title = 'PIONEERS',
  showBackButton = false,
  showMenuButton = false,
  showSearchButton = true,
  showNotificationButton = true,
  showOptionsButton = false,
  onBackPress,
  onMenuPress,
  onSearchPress,
  onNotificationPress,
  onOptionsPress,
  backgroundColor = '#8E1616',
  textColor = '#FFFFFF',
  variant = 'default',
}: AppBarProps) {
  return (
    <SafeAreaView
      style={{ backgroundColor }}
      edges={['top']}
      className=" overflow-hidden"
    >
      <View
        className="flex-row items-center justify-between px-6 py-4"
        style={{ backgroundColor }}
      >
        {/* Left Side */}
        <View className="flex-row items-center flex-1">
          {/* Back Button */}
          {showBackButton && (
            <TouchableOpacity onPress={onBackPress} className="p-2 mr-2 -ml-2">
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>
          )}

          {/* Menu Button */}
          {showMenuButton && !showBackButton && (
            <TouchableOpacity onPress={onMenuPress} className="p-2 mr-2 -ml-2">
              <Menu size={20} color="white" />
            </TouchableOpacity>
          )}

          <Title className="text-2xl font-delight-black text-white">
            {title}
          </Title>
        </View>

        {/* Right Side */}
        <View className="flex-row items-center">
          {variant === 'default' && (
            <>
              {showSearchButton && (
                <TouchableOpacity
                  onPress={onSearchPress}
                  className="bg-white/20 rounded-full p-2 ml-1"
                >
                  <Search size={20} color="white" />
                </TouchableOpacity>
              )}

              {showNotificationButton && (
                <TouchableOpacity
                  onPress={onNotificationPress}
                  className="bg-white/20 rounded-full p-2 ml-2 relative"
                >
                  <Bell size={20} color="white" />
                  <View className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full items-center justify-center">
                    <Title className="text-xs font-delight-bold text-primary">
                      3
                    </Title>
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}

          {variant === 'simple' && showOptionsButton && (
            <TouchableOpacity
              onPress={onOptionsPress}
              className="bg-white/20 rounded-full p-2 ml-1"
            >
              <MoreVertical size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
