import UpcomingEvent from '@/components/home/UpcomingEventCard';
import Input from '@/components/ui/input';
import Paragraph from '@/components/ui/paragraph';
import { CardSkeleton } from '@/components/ui/skeleton';
import Title from '@/components/ui/title';
import { router } from 'expo-router';
import { Calendar, PlusCircle, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { eventService } from '../../../../services/event';

// Event type definition
interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  is_done: boolean;
  is_featured?: boolean;
}

export default function EventList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch events using event service
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventService.getAllEvents();
      setEvents(eventsData as Event[]);
      setAllEvents(eventsData as Event[]);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time listener
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupListener = async () => {
      try {
        setLoading(true);

        // Add a small delay to ensure Firebase is fully initialized
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Subscribe to real-time updates
        unsubscribe = eventService.subscribeToEvents((eventsData: any) => {
          console.log('Events received in events screen:', eventsData);
          setEvents(eventsData as Event[]);
          setAllEvents(eventsData as Event[]);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error setting up events listener:', error);
        setLoading(false);
        setEvents([]);
        setAllEvents([]);
      }
    };

    setupListener();

    // Cleanup subscription on unmount
    return () => {
      try {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe();
        }
      } catch (error) {
        console.error('Error cleaning up events listener:', error);
      }
    };
  }, []);

  // Search functionality using local filtering for real-time data
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setEvents(allEvents);
    } else {
      const searchResults = allEvents.filter(
        (event) =>
          event.title?.toLowerCase().includes(query.toLowerCase()) ||
          event.location?.toLowerCase().includes(query.toLowerCase()) ||
          event.description?.toLowerCase().includes(query.toLowerCase())
      );
      setEvents(searchResults);
    }
  };

  const filteredEvents = events;

  // Pull to refresh functionality (for manual refresh if needed)
  const onRefresh = async () => {
    setRefreshing(true);
    // Clear search when refreshing
    setSearchQuery('');
    setEvents(allEvents);
    // Small delay for visual feedback
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8E1616']}
            tintColor="#8E1616"
          />
        }
      >
        <View className="px-5 py-8">
          {/* Header */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Title className="text-2xl font-delight-bold text-gray-900">
                Events
              </Title>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Paragraph className="text-xs text-green-600 font-medium">
                  Live
                </Paragraph>
              </View>
            </View>
            <Paragraph className="text-gray-600">
              Manage and view all school events • Updates automatically
            </Paragraph>
          </View>

          {/* Search */}
          <View className="mb-6">
            <Input
              className="border-primary/60 rounded-lg py-3"
              placeholder="Search events..."
              value={searchQuery}
              onChangeText={handleSearch}
              leftIcon={<Search color="#8E1616" size={20} />}
            />
          </View>

          {/* Events List */}
          <View className="flex-col gap-4">
            {loading ? (
              <View className="bg-white rounded-2xl p-8 items-center">
                <ActivityIndicator size="large" color="#8E1616" />
                <Title className="text-gray-500 mt-4 text-center font-delight-semibold">
                  Loading events...
                </Title>
              </View>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() =>
                    console.log('Navigate to event details:', event.id)
                  }
                  activeOpacity={0.9}
                >
                  {loading ? (
                    <CardSkeleton />
                  ) : (
                    <UpcomingEvent
                      title={event.title}
                      description={event.description}
                      location={event.location}
                      date={event.date}
                      startTime={event.start_time}
                      endTime={event.end_time}
                      isDone={event.is_done}
                    />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View className="bg-white rounded-2xl p-8 items-center">
                <Calendar color="#9CA3AF" size={48} />
                <Title className="text-gray-500 mt-4 text-center font-delight-semibold">
                  {searchQuery ? 'No events found' : 'No events yet'}
                </Title>
                <Paragraph className="text-gray-400 text-center mt-2">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Use the + button to create your first event'}
                </Paragraph>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 130, // Above tab bar
          right: 20,
          width: 56,
          height: 56,
          backgroundColor: '#8E1616',
          borderRadius: 50,
          shadowColor: '#8E1616',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 1,
          elevation: 8,
        }}
        className="items-center justify-center"
        onPress={() => router.push('/events/create')}
        activeOpacity={0.8}
      >
        <PlusCircle color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
}
