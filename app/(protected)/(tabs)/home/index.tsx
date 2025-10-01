import { OngoingEvent, StatCard, UpcomingEvent } from '@/components/home';
import Paragraph from '@/components/ui/paragraph';
import { CardSkeleton, StatCardSkeleton } from '@/components/ui/skeleton';
import Title from '@/components/ui/title';
import { router, useFocusEffect } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { attendanceService } from '../../../../services/attendance';
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

export default function Home() {
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendanceCounts, setAttendanceCounts] = useState({
    loginCount: 0,
    logoutCount: 0,
  });

  // Fetch attendance counts for featured event with polling
  const fetchAttendanceCounts = async (eventId: string) => {
    try {
      console.log('Fetching attendance counts for event:', eventId);
      const records = await attendanceService.getEventAttendance(eventId);

      // Transform records to get login/logout counts
      let loginCount = 0;
      let logoutCount = 0;

      records.forEach((record: any) => {
        if (record.check_in_time) loginCount++;
        if (record.check_out_time) logoutCount++;
      });

      console.log('Attendance counts:', { loginCount, logoutCount });
      setAttendanceCounts({ loginCount, logoutCount });
    } catch (error) {
      console.error('Error fetching attendance counts:', error);
      setAttendanceCounts({ loginCount: 0, logoutCount: 0 });
    }
  };

  // Set up periodic refresh for attendance counts
  const setupAttendanceRefresh = (eventId: string) => {
    console.log('Setting up attendance refresh for event:', eventId);

    // Initial fetch
    fetchAttendanceCounts(eventId);

    // Set up interval to refresh every 5 seconds for more responsive updates
    const interval = setInterval(() => {
      fetchAttendanceCounts(eventId);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  };

  // Set up real-time listeners
  useEffect(() => {
    let featuredUnsubscribe: (() => void) | null = null;
    let upcomingUnsubscribe: (() => void) | null = null;
    let attendanceCleanup: (() => void) | null = null;

    const setupListeners = async () => {
      try {
        // Add a small delay to ensure Firebase is fully initialized
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Subscribe to featured event
        featuredUnsubscribe = eventService.subscribeToFeaturedEvent(
          (event: any) => {
            console.log('Featured event received:', event);
            setFeaturedEvent(event);
            setLoading(false);

            // Clean up previous attendance listener
            if (attendanceCleanup) {
              attendanceCleanup();
            }

            // Set up attendance refresh for the featured event
            if (event && event.id) {
              attendanceCleanup = setupAttendanceRefresh(event.id);
            } else {
              setAttendanceCounts({ loginCount: 0, logoutCount: 0 });
            }
          }
        );

        // Subscribe to upcoming events (limit to 3)
        upcomingUnsubscribe = eventService.subscribeToHomeUpcomingEvents(
          (events: any) => {
            console.log('Upcoming events received:', events);
            console.log('Number of upcoming events:', events?.length || 0);
            if (events && events.length > 0) {
              console.log('First upcoming event:', events[0]);
              console.log('Event fields:', Object.keys(events[0]));
            }
            setUpcomingEvents(events || []);
            setLoading(false);
          },
          3
        );
      } catch (error) {
        console.error('Error setting up home screen listeners:', error);
        setLoading(false);
        // Set default values in case of error
        setFeaturedEvent(null);
        setUpcomingEvents([]);
      }
    };

    setupListeners();

    // Cleanup subscriptions on unmount
    return () => {
      try {
        if (featuredUnsubscribe && typeof featuredUnsubscribe === 'function') {
          featuredUnsubscribe();
        }
        if (upcomingUnsubscribe && typeof upcomingUnsubscribe === 'function') {
          upcomingUnsubscribe();
        }
        if (attendanceCleanup && typeof attendanceCleanup === 'function') {
          attendanceCleanup();
        }
      } catch (error) {
        console.error('Error cleaning up listeners:', error);
      }
    };
  }, []);

  // Refresh attendance data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (featuredEvent && featuredEvent.id) {
        console.log('Screen focused, refreshing attendance data');
        fetchAttendanceCounts(featuredEvent.id);
      }
    }, [featuredEvent])
  );

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View className="px-5 py-8">
        {/* Featured Event Section */}
        <View className="mb-10">
          <View className="flex-row items-center gap-3 mb-6">
            <View className="bg-primary/15 rounded-full p-2.5">
              <Calendar color="#8E1616" size={22} />
            </View>
            <Title className="text-2xl font-delight-black text-gray-900">
              Featured Event
            </Title>
          </View>

          {loading ? (
            <CardSkeleton />
          ) : featuredEvent ? (
            <OngoingEvent
              id={featuredEvent.id}
              isDone={featuredEvent.is_done}
              location={featuredEvent.location}
              title={featuredEvent.title}
              description={featuredEvent.description}
              startTime={featuredEvent.start_time}
              endTime={featuredEvent.end_time}
              date={featuredEvent.date}
            />
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center">
              <Calendar color="#9CA3AF" size={48} />
              <Title className="text-gray-500 mt-4 text-center font-delight-semibold">
                No Featured Event
              </Title>
              <Paragraph className="text-gray-400 text-center mt-2">
                No event is currently featured
              </Paragraph>
            </View>
          )}
        </View>

        {/* Attendance Summary */}
        <View className="mb-10">
          <Title className="text-xl font-delight-bold text-gray-900 mb-6">
            Attendance Summary
          </Title>
          <View className="flex-row gap-4">
            {loading || !featuredEvent ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  type="in"
                  count={attendanceCounts.loginCount}
                  label="Login"
                  onPress={() => {
                    if (featuredEvent) {
                      router.push({
                        pathname: '/events/attendance',
                        params: {
                          type: 'login',
                          eventId: featuredEvent.id,
                          eventTitle: featuredEvent.title,
                        },
                      });
                    }
                  }}
                />
                <StatCard
                  type="out"
                  count={attendanceCounts.logoutCount}
                  label="Logout"
                  onPress={() => {
                    if (featuredEvent) {
                      router.push({
                        pathname: '/events/attendance',
                        params: {
                          type: 'logout',
                          eventId: featuredEvent.id,
                          eventTitle: featuredEvent.title,
                        },
                      });
                    }
                  }}
                />
              </>
            )}
          </View>
        </View>

        {/* Upcoming Events Section */}
        <View className="flex flex-col gap-5">
          <View className="flex-row justify-between items-center">
            <Title className="text-xl font-delight-bold text-gray-900">
              Upcoming Events
            </Title>
            <TouchableOpacity
              className="bg-primary/15 rounded-full px-5 py-2.5"
              onPress={() => router.push('/(protected)/(tabs)/events')}
            >
              <Paragraph className="text-primary text-sm font-delight-semibold">
                View All
              </Paragraph>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-3">
            {loading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <UpcomingEvent
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  location={event.location}
                  startTime={event.start_time}
                  endTime={event.end_time}
                  isDone={event.is_done}
                  date={event.date}
                />
              ))
            ) : (
              <View className="bg-white rounded-2xl p-8 items-center">
                <Calendar color="#9CA3AF" size={48} />
                <Title className="text-gray-500 mt-4 text-center font-delight-semibold">
                  No Upcoming Events
                </Title>
                <Paragraph className="text-gray-400 text-center mt-2">
                  No upcoming events scheduled
                </Paragraph>
                <TouchableOpacity
                  className="bg-primary rounded-lg px-4 py-2 mt-4"
                  onPress={() => router.push('/events/create')}
                >
                  <Paragraph className="text-white font-delight-semibold">
                    Create Event
                  </Paragraph>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
