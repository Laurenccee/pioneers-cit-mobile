import React, { ReactNode } from 'react';
import { Switch, Text, View } from 'react-native';
import Input from '../ui/input';
import Paragraph from '../ui/paragraph';

interface FormSectionProps {
  title?: string;
  children: ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
}) => {
  return (
    <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
      {title && (
        <Paragraph className="text-lg font-bold text-gray-800 mb-4">
          {title}
        </Paragraph>
      )}
      {children}
    </View>
  );
};

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  textAreaHeight?: number;
  icon?: ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  multiline = false,
  numberOfLines = 1,
  textAreaHeight = 120,
  icon,
}) => {
  return (
    <View className="mb-6">
      <Paragraph className="text-base font-semibold text-gray-800 mb-3">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Paragraph>
      <Input
        leftIcon={icon}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        style={
          multiline
            ? { height: textAreaHeight, textAlignVertical: 'top' }
            : undefined
        }
        blurOnSubmit={false}
        enablesReturnKeyAutomatically={false}
      />
      {error && (
        <Paragraph className="text-red-500 text-sm mt-2 ml-2">
          {error}
        </Paragraph>
      )}
    </View>
  );
};

interface ToggleFieldProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  description,
  value,
  onValueChange,
}) => {
  return (
    <View className="flex-row items-center justify-between py-4">
      <View className="flex-1 mr-4">
        <Paragraph className="text-base font-semibold text-gray-800">
          {label}
        </Paragraph>
        <Paragraph className="text-sm text-gray-600 mt-1">
          {description}
        </Paragraph>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e5e7eb', true: '#8E1616' }}
        thumbColor={value ? '#ffffff' : '#f3f4f6'}
        ios_backgroundColor="#e5e7eb"
      />
    </View>
  );
};
