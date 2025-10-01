import Paragraph from '@/components/ui/paragraph';
import Title from '@/components/ui/title';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { LogIn, LogOut, User } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { attendanceService } from '../../../services/attendance';

// Student attendance record type
interface AttendanceRecord {
  id: string;
  student_name: string;
  student_id: string;
  student_email?: string;
  student_major?: string;
  student_course?: string;
  student_year?: string;
  student_section?: string;
  check_in_time: any; // Firestore timestamp
  check_out_time?: any; // Firestore timestamp or null
  event_id: string;
  created_at: any;
  updated_at: any;
}

export default function AttendanceList() {
  let params: any = {};
  try {
    params = useLocalSearchParams<{
      type: 'login' | 'logout';
      eventId: string;
      eventTitle: string;
    }>();
  } catch (error) {
    console.error('Navigation context error:', error);
    // Fallback params
    params = {
      type: 'login',
      eventId: 'IXMaEzKCuvXg0tijg0sj',
      eventTitle: 'Event Attendance',
    };
  }

  const { type, eventId, eventTitle } = params;

  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'login' | 'logout'>(
    type || 'login'
  );

  const fetchAttendanceData = useCallback(
    async (showLoading = true) => {
      if (!eventId) {
        console.warn('No event ID provided');
        if (showLoading) setLoading(false);
        return;
      }

      if (showLoading) setLoading(true);
      try {
        console.log('Fetching attendance data for event:', eventId);
        const records = await attendanceService.getEventAttendance(eventId);
        console.log('Fetched attendance records:', records.length);
        setAttendanceRecords(records as AttendanceRecord[]);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setAttendanceRecords([]);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [eventId]
  );

  // Setup real-time attendance refresh (every 5 seconds)
  useEffect(() => {
    if (eventId) {
      // Initial load with loading state
      fetchAttendanceData(true);

      // Silent refreshes every 5 seconds (no loading spinner)
      const intervalId = setInterval(() => fetchAttendanceData(false), 5000);

      return () => clearInterval(intervalId);
    }
  }, [eventId, fetchAttendanceData]);

  // Refresh immediately when screen comes into focus (silent refresh)
  useFocusEffect(
    useCallback(() => {
      if (eventId) {
        fetchAttendanceData(false);
      }
    }, [eventId, fetchAttendanceData])
  );

  const formatTime = (timestamp: any) => {
    let date: Date;
    if (timestamp && timestamp.toDate) {
      // Firestore timestamp
      date = timestamp.toDate();
    } else if (timestamp) {
      // Regular date string or Date object
      date = new Date(timestamp);
    } else {
      return 'N/A';
    }

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (timestamp: any) => {
    let date: Date;
    if (timestamp && timestamp.toDate) {
      // Firestore timestamp
      date = timestamp.toDate();
    } else if (timestamp) {
      // Regular date string or Date object
      date = new Date(timestamp);
    } else {
      return 'N/A';
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Transform attendance records into login/logout entries
  const transformedRecords = attendanceRecords.flatMap((record) => {
    const records = [];

    // Add login record
    if (record.check_in_time) {
      records.push({
        ...record,
        type: 'login' as const,
        timestamp: record.check_in_time,
        action_time: record.check_in_time,
      });
    }

    // Add logout record if exists
    if (record.check_out_time) {
      records.push({
        ...record,
        type: 'logout' as const,
        timestamp: record.check_out_time,
        action_time: record.check_out_time,
      });
    }

    return records;
  });

  const filteredRecords = transformedRecords.filter(
    (record) => record.type === activeTab
  );

  const loginCount = transformedRecords.filter(
    (r) => r.type === 'login'
  ).length;
  const logoutCount = transformedRecords.filter(
    (r) => r.type === 'logout'
  ).length;

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View className="px-5 py-8">
        {/* Event Header Section */}
        <View className="mb-8">
          <View className="flex-row items-center gap-3 mb-6">
            <View className="bg-primary/15 rounded-full p-2.5">
              <User color="#8E1616" size={22} />
            </View>
            <Title className="text-2xl font-delight-black text-gray-900">
              {eventTitle || 'Event Attendance'}
            </Title>
          </View>

          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row justify-between items-center">
              <View className="items-center flex-1">
                <Title className="text-2xl font-delight-bold text-primary">
                  {loginCount}
                </Title>
                <Paragraph className="text-gray-500 text-sm font-delight-medium">
                  Total Logins
                </Paragraph>
              </View>
              <View className="w-px h-12 bg-gray-200" />
              <View className="items-center flex-1">
                <Title className="text-2xl font-delight-bold text-primary">
                  {logoutCount}
                </Title>
                <Paragraph className="text-gray-500 text-sm font-delight-medium">
                  Total Logouts
                </Paragraph>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Selector */}
        <View className="mb-6">
          <View className="bg-gray-100 rounded-2xl p-1">
            <View className="flex-row">
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 16,
                  borderRadius: 12,
                  backgroundColor:
                    activeTab === 'login' ? '#8E1616' : 'transparent',
                  shadowColor: activeTab === 'login' ? '#000' : 'transparent',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: activeTab === 'login' ? 0.1 : 0,
                  shadowRadius: 2,
                  elevation: activeTab === 'login' ? 2 : 0,
                }}
                onPress={() => setActiveTab('login')}
              >
                <LogIn
                  size={18}
                  color={activeTab === 'login' ? 'white' : '#8E1616'}
                />
                <Paragraph
                  style={{
                    marginLeft: 8,
                    fontWeight: '600',
                    color: activeTab === 'login' ? 'white' : '#8E1616',
                  }}
                >
                  Login ({loginCount})
                </Paragraph>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 16,
                  borderRadius: 12,
                  backgroundColor:
                    activeTab === 'logout' ? '#8E1616' : 'transparent',
                  shadowColor: activeTab === 'logout' ? '#000' : 'transparent',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: activeTab === 'logout' ? 0.1 : 0,
                  shadowRadius: 2,
                  elevation: activeTab === 'logout' ? 2 : 0,
                }}
                onPress={() => setActiveTab('logout')}
              >
                <LogOut
                  size={18}
                  color={activeTab === 'logout' ? 'white' : '#8E1616'}
                />
                <Paragraph
                  style={{
                    marginLeft: 8,
                    fontWeight: '600',
                    color: activeTab === 'logout' ? 'white' : '#8E1616',
                  }}
                >
                  Logout ({logoutCount})
                </Paragraph>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Attendance List */}
        <View className="flex-col gap-3">
          {loading ? (
            <View className="bg-white rounded-2xl p-8 items-center">
              <ActivityIndicator size="large" color="#8E1616" />
              <Paragraph className="text-gray-500 mt-4 text-center">
                Loading attendance records...
              </Paragraph>
            </View>
          ) : filteredRecords.length > 0 ? (
            filteredRecords.map((item, index) => (
              <View
                key={`${item.id}-${item.type}-${index}`}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View
                      style={{
                        borderRadius: 20,
                        padding: 12,
                        marginRight: 16,
                        backgroundColor:
                          item.type === 'login'
                            ? 'rgba(142, 22, 22, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                      }}
                    >
                      <User
                        size={20}
                        color={item.type === 'login' ? '#8E1616' : '#EF4444'}
                      />
                    </View>

                    <View className="flex-1">
                      <Title className="text-gray-900 font-delight-bold text-lg mb-1">
                        {item.student_name || 'Unknown Student'}
                      </Title>
                      <Paragraph className="text-gray-500 text-sm font-delight-medium">
                        ID: {item.student_id || 'N/A'}
                      </Paragraph>
                      {item.student_major && (
                        <Paragraph className="text-gray-400 text-xs font-delight-medium">
                          {item.student_course || 'Unknown Course'} •{' '}
                          {item.student_major} {item.student_year}
                          {item.student_section}
                        </Paragraph>
                      )}
                    </View>
                  </View>

                  <View className="items-end">
                    <Paragraph className="text-gray-900 font-delight-semibold text-base">
                      {formatTime(item.action_time)}
                    </Paragraph>
                    <Paragraph className="text-gray-400 text-sm font-delight-medium">
                      {formatDate(item.action_time)}
                    </Paragraph>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center">
              {activeTab === 'login' ? (
                <LogIn size={48} color="#9CA3AF" />
              ) : (
                <LogOut size={48} color="#9CA3AF" />
              )}
              <Title className="text-gray-500 mt-4 text-center font-delight-semibold">
                No {activeTab} records
              </Title>
              <Paragraph className="text-gray-400 text-center mt-2">
                No students have{' '}
                {activeTab === 'login' ? 'logged in' : 'logged out'} yet
              </Paragraph>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
