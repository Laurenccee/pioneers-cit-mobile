import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Clock } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Paragraph from '../ui/paragraph';

interface DatePickerFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  error?: string;
  required?: boolean;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  placeholder,
  onPress,
  error,
  required = false,
}) => {
  return (
    <View className="mb-6">
      <Paragraph className="text-base font-semibold text-gray-800 mb-3">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Paragraph>
      <Pressable
        onPress={onPress}
        className="border-2 border-primary rounded-lg flex-row items-center gap-2 px-4 py-3 min-h-[50px]"
      >
        <Calendar size={18} color="#8E1616" />
        <Text
          className={`flex-1 text-base font-sans ${value ? 'text-gray-800' : 'text-[#8E1616]'}`}
        >
          {value || placeholder}
        </Text>
      </Pressable>
      {error && (
        <Paragraph className="text-red-500 text-sm mt-2 ml-2">
          {error}
        </Paragraph>
      )}
    </View>
  );
};

interface TimePickerFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  error?: string;
  required?: boolean;
}

export const TimePickerField: React.FC<TimePickerFieldProps> = ({
  label,
  value,
  placeholder,
  onPress,
  error,
  required = false,
}) => {
  return (
    <View className="flex-1">
      <Paragraph className="text-base font-semibold text-gray-800 mb-3">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Paragraph>
      <Pressable
        onPress={onPress}
        className="border-2 border-primary rounded-lg flex-row items-center gap-2 px-4 py-3 min-h-[50px]"
      >
        <Clock size={18} color="#8E1616" />
        <Text
          className={`flex-1 text-base font-sans ${value ? 'text-gray-800' : 'text-[#8E1616]'}`}
        >
          {value || placeholder}
        </Text>
      </Pressable>
      {error && (
        <Paragraph className="text-red-500 text-sm mt-2 ml-2">
          {error}
        </Paragraph>
      )}
    </View>
  );
};

interface DateTimePickerModalProps {
  show: boolean;
  value: Date;
  mode: 'date' | 'time';
  onChange: (event: any, selectedDate?: Date) => void;
  minimumDate?: Date;
}

export const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({
  show,
  value,
  mode,
  onChange,
  minimumDate,
}) => {
  if (!show) return null;

  return (
    <DateTimePicker
      value={value}
      mode={mode}
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      onChange={onChange}
      minimumDate={minimumDate}
    />
  );
};
