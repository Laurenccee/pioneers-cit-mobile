import OngoingEvent from '@/components/Home/ongoing-card';
import { StatCard } from '@/components/Home/stat-card';
import UpcommingEvent from '@/components/Home/upcomming-card';
import Paragraph from '@/components/ui/paragraph';
import Title from '@/components/ui/title';
import { Calendar } from 'lucide-react-native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export default function Home() {
  // Main event data - could come from API/database
  const mainEvent = {
    id: '1',
    title: 'AKWE 2025',
    description:
      'Annual Acquaintance Party 2025 - Join us for an exciting evening of networking and celebration.',
    location: 'IYAGI - Kalibo, Aklan',
    date: '2025-10-15',
    startTime: '06:00 PM',
    endTime: '11:00 PM',
    isDone: false,
  };

  // Upcoming events data - could come from API/database
  const upcomingEvents = [
    {
      id: '2',
      title: 'PAIDIS INDIS - 2025',
      description:
        'Professional Association for Innovation and Development in Information Systems',
      location: 'Conference Center, Manila',
      date: '2025-11-22',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      isDone: false,
    },
    {
      id: '3',
      title: 'Tech Summit 2025',
      description:
        'Annual technology summit featuring the latest innovations and trends',
      location: 'SMX Convention Center, Pasay',
      date: '2025-12-05',
      startTime: '08:30 AM',
      endTime: '06:00 PM',
      isDone: false,
    },
    {
      id: '4',
      title: 'Student Leadership Forum',
      description: 'Empowering the next generation of student leaders',
      location: 'University Auditorium, Iloilo',
      date: '2025-12-18',
      startTime: '01:00 PM',
      endTime: '05:00 PM',
      isDone: false,
    },
  ];

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

          <OngoingEvent
            isDone={mainEvent.isDone}
            location={mainEvent.location}
            title={mainEvent.title}
            description={mainEvent.description}
            startTime={mainEvent.startTime}
            endTime={mainEvent.endTime}
          />
        </View>

        {/* Attendance Summary */}
        <View className="mb-10">
          <Title className="text-xl font-delight-bold text-gray-900 mb-6">
            Attendance Summary
          </Title>
          <View className="flex-row gap-4">
            <StatCard type="present" count={186} label="Present" />
            <StatCard type="late" count={24} label="Late" />
            <StatCard type="absent" count={38} label="Absent" />
          </View>
        </View>

        {/* Upcoming Events Section */}
        <View className="flex flex-col gap-5">
          <View className="flex-row justify-between items-center">
            <Title className="text-xl font-delight-bold text-gray-900">
              Upcoming Events
            </Title>
            <TouchableOpacity className="bg-primary/15 rounded-full px-5 py-2.5">
              <Paragraph className="text-primary text-sm font-delight-semibold">
                View All
              </Paragraph>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-3">
            {upcomingEvents.map((event) => (
              <UpcommingEvent
                key={event.id}
                title={event.title}
                description={event.description}
                location={event.location}
                startTime={event.startTime}
                endTime={event.endTime}
                isDone={event.isDone}
                date={event.date}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
