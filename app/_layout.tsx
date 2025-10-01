import { useFonts } from 'expo-font';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';
import { AuthContextProvider, useAuth } from '../context/auth-context';
import '../global.css';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated == 'undefined') return; // still loading
    const inApp = segments[0] == '(protected)';
    if (isAuthenticated && !inApp) {
      // Redirect to the main app
      router.replace('/(protected)/(tabs)/home');
    } else if (isAuthenticated == false) {
      // Redirect to the login page
      router.replace('/(auth)/login-screen');
    }
  }, [isAuthenticated]);
  return <Slot />;
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Delight: require('../assets/fonts/delight-regular.ttf'),
    'Delight-Bold': require('../assets/fonts/delight-bold.ttf'),
    'Delight-Light': require('../assets/fonts/delight-light.ttf'),
    'Delight-Medium': require('../assets/fonts/delight-medium.ttf'),
    'Delight-Semibold': require('../assets/fonts/delight-semibold.ttf'),
    'Delight-Black': require('../assets/fonts/delight-black.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContextProvider>
        <MainLayout />
        <Toaster />
      </AuthContextProvider>
    </GestureHandlerRootView>
  );
}
