import { Eye, EyeClosed } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface InputProps extends TextInputProps {
  className?: string;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
}

export default function Input({
  className = '',
  placeholder,
  isPassword = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Determine what left icon to show
  const getLeftIcon = () => {
    if (leftIcon) {
      return leftIcon;
    }
    return null;
  };

  // Determine what right icon to show
  const getRightIcon = () => {
    if (rightIcon) {
      return rightIcon;
    } else if (isPassword) {
      // Default password toggle icon
      return showPassword ? (
        <EyeClosed size={24} color="#8E1616" />
      ) : (
        <Eye size={24} color="#8E1616" />
      );
    }
    return null;
  };

  // Handle right icon press
  const handleRightIconPress = () => {
    if (onRightIconPress) {
      onRightIconPress();
    } else if (isPassword) {
      setShowPassword(!showPassword);
    }
  };

  const leftIconElement = getLeftIcon();
  const rightIconElement = getRightIcon();

  return (
    <View
      className={`border-2 border-primary rounded-lg flex flex-row gap-2 items-center px-4 py-2 ${className}`}
    >
      {/* Left icon */}
      {leftIconElement}

      <TextInput
        secureTextEntry={isPassword && !showPassword}
        placeholder={placeholder}
        className="text-md flex-1 font-sans"
        placeholderTextColor="#8E1616"
        {...props}
      />

      {/* Right icon */}
      {rightIconElement && (
        <TouchableOpacity onPress={handleRightIconPress}>
          {rightIconElement}
        </TouchableOpacity>
      )}
    </View>
  );
}
