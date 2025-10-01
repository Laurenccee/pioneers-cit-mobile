import Paragraph from '@/components/ui/paragraph';
import Title from '@/components/ui/title';
import { Scan } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export default function ScannerInstructions() {
  return (
    <>
      <View className="flex-row items-center gap-3 mb-4">
        <View className="bg-primary/10 rounded-xl p-2.5">
          <Scan size={18} color="#8E1616" />
        </View>
        <Title className="text-white font-delight-bold text-lg">
          Scanning Tips
        </Title>
      </View>

      <View className="bg-white/[0.02] rounded-2xl p-4 space-y-3 border border-white/5">
        <View className="flex-row items-start gap-3">
          <View className="bg-primary rounded-full w-1.5 h-1.5 mt-2.5" />
          <Paragraph className="text-white/80 font-delight-medium text-sm flex-1 leading-relaxed">
            Hold device steady and point at the student ID
          </Paragraph>
        </View>
        <View className="flex-row items-start gap-3">
          <View className="bg-primary rounded-full w-1.5 h-1.5 mt-2.5" />
          <Paragraph className="text-white/80 font-delight-medium text-sm flex-1 leading-relaxed">
            Ensure good lighting or use the flashlight button
          </Paragraph>
        </View>
        <View className="flex-row items-start gap-3">
          <View className="bg-primary rounded-full w-1.5 h-1.5 mt-2.5" />
          <Paragraph className="text-white/80 font-delight-medium text-sm flex-1 leading-relaxed">
            Wait for the scanning line to pass over the code
          </Paragraph>
        </View>
      </View>
    </>
  );
}
