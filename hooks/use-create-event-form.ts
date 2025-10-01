import { router } from 'expo-router';
import { useState } from 'react';
import { toast } from 'sonner-native';
import { eventService } from '../services/event';

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  is_done: boolean;
  is_featured: boolean;
}

export const useCreateEventForm = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: '',
    date: '',
    start_time: '',
    end_time: '',
    is_done: false,
    is_featured: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Date/Time picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());

  const updateFormData = (
    field: keyof EventFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Date picker handlers
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      updateFormData('date', formattedDate);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setSelectedStartTime(selectedTime);
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      updateFormData('start_time', `${hours}:${minutes}`);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setSelectedEndTime(selectedTime);
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      updateFormData('end_time', `${hours}:${minutes}`);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';
    if (!formData.start_time.trim())
      newErrors.start_time = 'Start time is required';
    if (!formData.end_time.trim()) newErrors.end_time = 'End time is required';

    // Validate date format
    if (formData.date && !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      newErrors.date = 'Date must be in YYYY-MM-DD format';
    }

    // Validate time format
    if (formData.start_time && !/^\d{2}:\d{2}$/.test(formData.start_time)) {
      newErrors.start_time = 'Time must be in HH:MM format';
    }

    if (formData.end_time && !/^\d{2}:\d{2}$/.test(formData.end_time)) {
      newErrors.end_time = 'Time must be in HH:MM format';
    }

    // Validate that end time is after start time
    if (
      formData.start_time &&
      formData.end_time &&
      /^\d{2}:\d{2}$/.test(formData.start_time) &&
      /^\d{2}:\d{2}$/.test(formData.end_time)
    ) {
      const [startHour, startMin] = formData.start_time.split(':').map(Number);
      const [endHour, endMin] = formData.end_time.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (endMinutes <= startMinutes) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    setErrors(newErrors);

    // Show toast notification for validation errors
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error('Please fix the form errors', {
        description: firstError,
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Use event service to create event
        const eventId = await eventService.createEvent(formData);

        console.log('Event created with ID:', eventId);

        toast.success('Event created successfully!', {
          description: 'It will appear in the events list automatically.',
        });

        // Reset form after successful submission
        setFormData({
          title: '',
          description: '',
          location: '',
          date: '',
          start_time: '',
          end_time: '',
          is_done: false,
          is_featured: false,
        });

        // Reset date/time pickers
        setSelectedDate(new Date());
        setSelectedStartTime(new Date());
        setSelectedEndTime(new Date());

        // Navigate to home with a reliable approach
        setTimeout(() => {
          try {
            // Use replace instead of back to avoid mounting issues
            router.replace('/(protected)/(tabs)/home');
          } catch (error) {
            console.warn('Navigation error:', error);
            // If replace fails, try push as fallback
            setTimeout(() => {
              try {
                router.push('/(protected)/(tabs)/home');
              } catch (fallbackError) {
                console.error('All navigation attempts failed:', fallbackError);
              }
            }, 200);
          }
        }, 2000); // Longer delay to ensure router is ready
      } catch (error) {
        console.error('Error creating event:', error);
        toast.error('Failed to create event', {
          description: 'Please check your connection and try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    // Form data
    formData,
    errors,
    isSubmitting,
    updateFormData,

    // Date/Time picker states
    showDatePicker,
    showStartTimePicker,
    showEndTimePicker,
    selectedDate,
    selectedStartTime,
    selectedEndTime,
    setShowDatePicker,
    setShowStartTimePicker,
    setShowEndTimePicker,

    // Handlers
    handleDateChange,
    handleStartTimeChange,
    handleEndTimeChange,
    handleSubmit,
  };
};
