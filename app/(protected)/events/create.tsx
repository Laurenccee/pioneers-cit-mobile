import {
  DatePickerField,
  DateTimePickerModal,
  TimePickerField,
} from '@/components/event/date-time-picker';
import {
  FormField,
  FormSection,
  ToggleField,
} from '@/components/event/form-components';
import Button from '@/components/ui/button';
import Paragraph from '@/components/ui/paragraph';
import { useCreateEventForm } from '@/hooks/use-create-event-form';
import { FileText, MapPin, Save } from 'lucide-react-native';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CreateEvent = () => {
  const insets = useSafeAreaInsets();

  const {
    formData,
    errors,
    isSubmitting,
    updateFormData,
    showDatePicker,
    showStartTimePicker,
    showEndTimePicker,
    selectedDate,
    selectedStartTime,
    selectedEndTime,
    setShowDatePicker,
    setShowStartTimePicker,
    setShowEndTimePicker,
    handleDateChange,
    handleStartTimeChange,
    handleEndTimeChange,
    handleSubmit,
  } = useCreateEventForm();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: Platform.OS === 'ios' ? 120 : 140,
        }}
        keyboardShouldPersistTaps="always"
      >
        <View className="px-5">
          {/* Basic Information */}
          <FormSection title="Event Information">
            <FormField
              label="Event Title"
              value={formData.title}
              onChangeText={(value) => updateFormData('title', value)}
              placeholder="e.g., Annual School Festival 2025"
              error={errors.title}
              required
              icon={<FileText size={18} color="#8E1616" />}
            />

            <FormField
              label="Description"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              placeholder="Brief description of the event..."
              error={errors.description}
              required
              multiline
              numberOfLines={6}
              textAreaHeight={150}
              icon={<FileText size={18} color="#8E1616" />}
            />

            <FormField
              label="Location"
              value={formData.location}
              onChangeText={(value) => updateFormData('location', value)}
              placeholder="e.g., Main Auditorium, School Gymnasium"
              error={errors.location}
              required
              icon={<MapPin size={18} color="#8E1616" />}
            />
          </FormSection>

          {/* Date & Time */}
          <FormSection title="Date & Time">
            <DatePickerField
              label="Event Date"
              value={formData.date}
              placeholder="Select event date"
              onPress={() => setShowDatePicker(true)}
              error={errors.date}
              required
            />

            <View className="flex-row gap-4">
              <TimePickerField
                label="Start Time"
                value={formData.start_time}
                placeholder="Start time"
                onPress={() => setShowStartTimePicker(true)}
                error={errors.start_time}
                required
              />

              <TimePickerField
                label="End Time"
                value={formData.end_time}
                placeholder="End time"
                onPress={() => setShowEndTimePicker(true)}
                error={errors.end_time}
                required
              />
            </View>
          </FormSection>

          {/* Settings */}
          <FormSection title="Event Settings">
            <ToggleField
              label="Featured Event"
              description="Featured events appear at the top of the list"
              value={formData.is_featured}
              onValueChange={(value) => updateFormData('is_featured', value)}
            />

            <View className="bg-primary/5 rounded-xl p-4 border border-primary/10 mt-4">
              <Paragraph className="text-primary text-sm font-medium">
                💡 Tap on date and time fields to select using native pickers
              </Paragraph>
            </View>
          </FormSection>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="px-5 pb-8">
        <Button
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`${
            isSubmitting ? 'bg-gray-400' : 'bg-primary'
          } rounded-2xl py-5 shadow-lg`}
        >
          <Save size={20} color="white" />
          <Paragraph className="text-white text-lg font-bold">
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </Paragraph>
        </Button>
        <View style={{ paddingBottom: insets.bottom }} />
      </View>

      {/* Native Date/Time Pickers */}
      <DateTimePickerModal
        show={showDatePicker}
        value={selectedDate}
        mode="date"
        onChange={handleDateChange}
        minimumDate={new Date()}
      />

      <DateTimePickerModal
        show={showStartTimePicker}
        value={selectedStartTime}
        mode="time"
        onChange={handleStartTimeChange}
      />

      <DateTimePickerModal
        show={showEndTimePicker}
        value={selectedEndTime}
        mode="time"
        onChange={handleEndTimeChange}
      />
    </KeyboardAvoidingView>
  );
};

export default CreateEvent;
