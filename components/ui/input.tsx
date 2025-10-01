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
      className={`border-2 border-primary rounded-lg flex flex-row gap-2 items-center px-4 ${props.multiline ? 'py-2' : 'py-3 min-h-[50px]'} ${className}`}
    >
      {/* Left icon */}
      {leftIconElement && (
        <View className={props.multiline ? 'self-start mt-2' : 'self-center'}>
          {leftIconElement}
        </View>
      )}

      <TextInput
        secureTextEntry={isPassword && !showPassword}
        placeholder={placeholder}
        className={`text-md flex-1 font-sans ${props.multiline ? 'py-2' : ''}`}
        placeholderTextColor="#8E1616"
        style={[
          props.multiline && {
            textAlignVertical: 'top',
            paddingTop: 8,
            minHeight: 120,
          },
          props.style,
        ]}
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
