import Button from '@/components/ui/button';
import Paragraph from '@/components/ui/paragraph';
import Title from '@/components/ui/title';
import { router } from 'expo-router';
import { CheckCircle, QrCode } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

interface StudentInfoDisplayProps {
  studentInfo: any;
  attendanceResult: any;
  action?: string;
  onScanAgain: () => void;
}

export default function StudentInfoDisplay({
  studentInfo,
  attendanceResult,
  action,
  onScanAgain,
}: StudentInfoDisplayProps) {
  const getStatusConfig = () => {
    if (attendanceResult.action === 'duplicate') {
      return {
        backgroundColor: '#8E1616',
        shadowColor: '#8E1616',
        statusColor: 'bg-primary/30',
        message: 'Student has already been scanned today.',
      };
    }
    switch (action) {
      case 'login':
        return {
          backgroundColor: '#8E1616',
          shadowColor: '#8E1616',
          statusColor: 'bg-primary/30',
          message:
            'Successfully logged in! Student attendance has been recorded.',
        };
      case 'logout':
        return {
          backgroundColor: '#8E1616',
          shadowColor: '#8E1616',
          statusColor: 'bg-primary/30',
          message:
            'Successfully logged out! Student departure has been recorded.',
        };
      default:
        return {
          backgroundColor: '#8E1616',
          shadowColor: '#8E1616',
          statusColor: 'bg-primary/30',
          message: 'Attendance action completed.',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <>
      {/* Student Info Card */}
      <View
        style={{
          backgroundColor: 'rgba(30, 30, 30, 0.75)',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 5,
        }}
        className="rounded-2xl overflow-hidden mb-4 border border-white/10"
      >
        <View className="px-5 py-5">
          {/* Student Name and ID */}
          <View className="mb-4">
            <Title className="text-white font-delight-black text-xl mb-1">
              {studentInfo.first_name && studentInfo.last_name
                ? `${studentInfo.first_name} ${studentInfo.last_name}`
                : studentInfo.name || 'Unknown Student'}
            </Title>
            <Paragraph className="text-white/80 font-delight-medium">
              Student ID: {attendanceResult.student_id}
            </Paragraph>
          </View>

          {/* Student Details */}
          <View className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/5">
            <View className="flex-row justify-between items-center">
              <Paragraph className="text-white/70 font-delight-medium text-sm">
                Course
              </Paragraph>
              <Paragraph className="text-white font-delight-semibold text-sm">
                {studentInfo.course || 'N/A'}
              </Paragraph>
            </View>
            <View className="flex-row justify-between items-center">
              <Paragraph className="text-white/70 font-delight-medium text-sm">
                Year Level
              </Paragraph>
              <Paragraph className="text-white font-delight-semibold text-sm">
                {studentInfo.year || 'N/A'}
              </Paragraph>
            </View>
            <View className="flex-row justify-between items-center">
              <Paragraph className="text-white/70 font-delight-medium text-sm">
                Time Scanned
              </Paragraph>
              <Paragraph className="text-white font-delight-semibold text-sm">
                {(() => {
                  if (!attendanceResult.timestamp) {
                    return new Date().toLocaleTimeString();
                  }

                  // Handle Firestore timestamp
                  if (attendanceResult.timestamp.seconds) {
                    return new Date(
                      attendanceResult.timestamp.seconds * 1000
                    ).toLocaleTimeString();
                  }

                  // Handle regular date object or string
                  if (attendanceResult.timestamp.toDate) {
                    return attendanceResult.timestamp
                      .toDate()
                      .toLocaleTimeString();
                  }

                  // Handle date string or timestamp number
                  return new Date(
                    attendanceResult.timestamp
                  ).toLocaleTimeString();
                })()}
              </Paragraph>
            </View>
          </View>
        </View>
      </View>

      {/* Attendance Status Card */}
      <View
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        }}
        className="rounded-2xl overflow-hidden mb-6"
      >
        <View className="px-5 py-5">
          <View className="flex-row items-center mb-3">
            <View
              className={`w-3 h-3 rounded-full mr-3 ${statusConfig.statusColor}`}
            />
            <Title className="text-white font-delight-bold text-lg">
              Attendance Status
            </Title>
          </View>
          <Paragraph className="text-white/90 font-delight-medium text-base leading-6">
            {statusConfig.message}
          </Paragraph>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-4">
        <Button
          className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 px-6"
          onPress={onScanAgain}
        >
          <QrCode size={18} color="white" />
          <Paragraph className="text-white font-delight-semibold text-base">
            Scan Again
          </Paragraph>
        </Button>

        <Button
          className="flex-1 bg-primary rounded-xl py-4 px-6"
          onPress={() => router.back()}
        >
          <CheckCircle size={18} color="white" />
          <Paragraph className="text-white font-delight-semibold text-base">
            Complete
          </Paragraph>
        </Button>
      </View>
    </>
  );
}
