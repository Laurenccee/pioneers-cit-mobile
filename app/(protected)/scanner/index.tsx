import {
  ScannerHeader,
  ScannerInstructions,
  ScanningLine,
  StudentInfoDisplay,
} from '@/components/scanner';
import Button from '@/components/ui/button';
import Paragraph from '@/components/ui/paragraph';
import Title from '@/components/ui/title';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertTriangle, QrCode, Target } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StatusBar, Vibration, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { attendanceService } from '../../../services/attendance';

interface BarcodeScanningResult {
  type: string;
  data: string;
}

export default function Scanner() {
  const { eventId, action } = useLocalSearchParams<{
    eventId: string;
    action?: string;
  }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scannerActive, setScannerActive] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [attendanceResult, setAttendanceResult] = useState<any>(null);

  const insets = useSafeAreaInsets();

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!scanned && !processing) {
      setScanned(true);
      setScannerActive(false);
      Vibration.vibrate(100);
      handleScanResult(result.type, result.data);
    }
  };

  const handleScanResult = async (type: string, data: string) => {
    console.log('Scanned:', { type, data });
    console.log('Event ID:', eventId);

    if (!eventId) {
      Alert.alert('❌ Error', 'No event selected for attendance tracking.', [
        {
          text: 'Go Back',
          onPress: () => router.back(),
        },
      ]);
      return;
    }

    setProcessing(true);

    try {
      const result = await attendanceService.processAttendance(
        data,
        eventId,
        action || 'attendance'
      );

      console.log('Attendance result:', result);

      // Check if the attendance processing was successful
      if (result.success === false) {
        // Handle business logic errors (already logged in/out, etc.)
        Alert.alert(
          '⚠️ Warning',
          result.message || result.error || 'Attendance processing failed.',
          [
            {
              text: 'Try Again',
              onPress: resetScanner,
            },
            {
              text: 'Go Back',
              onPress: () => router.back(),
            },
          ]
        );
        return;
      }

      setStudentInfo(result.student);
      setAttendanceResult(result);
    } catch (error: any) {
      console.error('Attendance processing error:', error);
      Alert.alert(
        '❌ Error',
        error.message || 'Failed to process attendance. Please try again.',
        [
          {
            text: 'Try Again',
            onPress: resetScanner,
          },
          {
            text: 'Go Back',
            onPress: () => router.back(),
          },
        ]
      );
    } finally {
      setProcessing(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setScannerActive(true);
    setStudentInfo(null);
    setAttendanceResult(null);
    setProcessing(false);
  };

  // Camera permission loading
  if (permission === null) {
    return (
      <View
        className="flex-1 bg-black justify-center items-center"
        style={{ paddingTop: insets.top }}
      >
        <View className="bg-white rounded-2xl p-8 mx-6 items-center">
          <QrCode size={60} color="#8E1616" />
          <Title className="text-xl text-gray-900 mt-4 mb-2 text-center">
            Camera Permission
          </Title>
          <Paragraph className="text-gray-600 text-center">
            Loading camera permissions...
          </Paragraph>
        </View>
      </View>
    );
  }

  // Camera permission not granted
  if (!permission.granted) {
    return (
      <View
        className="flex-1 bg-gray-50 justify-center"
        style={{ paddingTop: insets.top }}
      >
        <View className="px-5">
          <View className="bg-white rounded-3xl p-8 items-center shadow-lg">
            <View className="bg-red-50 rounded-full p-4 mb-6">
              <AlertTriangle size={48} color="#EF4444" />
            </View>
            <Title className="text-2xl font-delight-black text-gray-900 mb-3 text-center">
              Camera Access Required
            </Title>
            <Paragraph className="text-gray-600 text-center mb-8 leading-relaxed">
              We need camera access to scan student IDs and QR codes for
              attendance tracking.
            </Paragraph>
            <View className="flex-row gap-4 w-full">
              <Button
                className="flex-1 bg-gray-100 border border-gray-200"
                onPress={() => router.back()}
              >
                <Paragraph className="text-gray-700 font-delight-semibold">
                  Go Back
                </Paragraph>
              </Button>
              <Button
                className="flex-1 bg-primary border border-primary"
                onPress={requestPermission}
              >
                <Paragraph className="text-white font-delight-semibold">
                  Grant Access
                </Paragraph>
              </Button>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Camera View - Always Full Screen */}
      <CameraView
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        facing="back"
        flash={flashOn ? 'on' : 'off'}
        barcodeScannerSettings={{
          barcodeTypes: [
            'qr',
            'ean13',
            'ean8',
            'code39',
            'code128',
            'upc_a',
            'upc_e',
            'codabar',
            'code93',
            'itf14',
            'pdf417',
            'aztec',
            'datamatrix',
          ],
        }}
        onBarcodeScanned={scannerActive ? handleBarCodeScanned : undefined}
      />

      {/* Camera Dim Overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        }}
      />

      {/* Scanner Header - Absolute positioned */}
      <View className="absolute top-0 left-0 right-0 z-10">
        <ScannerHeader
          flashOn={flashOn}
          title={
            action === 'login'
              ? 'Login Scanner'
              : action === 'logout'
                ? 'Logout Scanner'
                : 'Event Scanner'
          }
          onToggleFlash={toggleFlash}
        />
      </View>

      {/* Scanner Info Box - Absolute positioned */}

      {/* Scanning Line - Absolute positioned */}
      <View className="absolute inset-0 z-5">
        <ScanningLine
          scannerActive={scannerActive}
          scanned={scanned}
          action={action}
        />
      </View>

      {/* Processing Overlay */}
      {processing && (
        <View className="absolute inset-0 justify-center items-center bg-black/50 z-20">
          <View
            style={{
              backgroundColor: '#1E1E1E',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 12,
            }}
            className="rounded-3xl p-8 mx-6 border border-white/10"
          >
            <View className="items-center">
              <View className="bg-primary/20 rounded-full p-4 mb-4">
                <Target size={32} color="#8E1616" />
              </View>
              <Title className="text-white font-delight-bold text-xl mb-2 text-center">
                Processing Scan
              </Title>
              <Paragraph className="text-white/70 font-delight-medium text-center">
                Please wait while we verify the attendance...
              </Paragraph>
            </View>
          </View>
        </View>
      )}

      {/* Student Info Display - Full Screen Overlay */}
      {studentInfo && attendanceResult && (
        <View className="absolute inset-0 bg-black/60 justify-end z-30">
          <View
            className="px-5"
            style={{
              paddingBottom: insets.bottom + 20,
            }}
          >
            <StudentInfoDisplay
              studentInfo={studentInfo}
              attendanceResult={attendanceResult}
              action={action}
              onScanAgain={resetScanner}
            />
          </View>
        </View>
      )}

      {/* Scanner Instructions - Bottom Panel */}
      {!studentInfo && !attendanceResult && (
        <View
          className="absolute bottom-0 left-0 right-0 px-5 z-10"
          style={{
            paddingBottom: insets.bottom + 20,
          }}
        >
          <View
            style={{
              backgroundColor: 'rgba(30, 30, 30, 0.75)',
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}
            className="rounded-3xl p-6"
          >
            <ScannerInstructions />
          </View>
        </View>
      )}
    </View>
  );
}
