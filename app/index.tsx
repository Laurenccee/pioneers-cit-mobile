import { ActivityIndicator, View } from 'react-native';
import '../global.css';

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="red" />
    </View>
  );
}
