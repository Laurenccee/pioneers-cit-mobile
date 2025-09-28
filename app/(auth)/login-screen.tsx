import CustomKeyboardAvoidingView from '@/components/layouts/keybaord-view';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Paragraph from '@/components/ui/paragraph';
import Title from '@/components/ui/title';
import { useAuth } from '@/context/auth-context';
import {
  ArrowRight,
  Loader2,
  Mail,
  RectangleEllipsis,
} from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn(email, password);
      setLoading(false);

      if (res.success) {
        console.log('Login successful:', res.user.email);
        console.log('User details:', res.user);
      } else {
        alert('Login failed: ' + res.error);
      }
    } catch (error) {
      setLoading(false);
      alert('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    }
  };
  return (
    <SafeAreaView className="flex-1 ">
      <CustomKeyboardAvoidingView>
        <View className="flex-1 justify-center px-6">
          <View className="w-full max-w-sm mx-auto flex flex-col gap-16">
            {/* Header Section */}
            <View className="items-center">
              <Title className="text-7xl">PIONEERS</Title>
              <Paragraph>Empowering Students, Enriching Communities</Paragraph>
            </View>

            {/* Form Section */}
            <View className="flex gap-4 flex-col">
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                leftIcon={<Mail size={24} color="#8E1616" />}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                leftIcon={<RectangleEllipsis size={24} color="#8E1616" />}
                isPassword={true}
                autoCapitalize="none"
                autoComplete="password"
              />

              {/* Login Button */}
            </View>
            <Button onPress={handleLogin} disabled={loading}>
              <Paragraph className="text-white text-xl text-center px-4 font-delight-black ">
                {loading ? 'SIGNING IN......' : 'SIGN IN'}
              </Paragraph>
              {loading ? (
                <Loader2 size={20} color="white" className="animate-spin" />
              ) : (
                <ArrowRight size={20} color="white" />
              )}
            </Button>
          </View>
        </View>
      </CustomKeyboardAvoidingView>
    </SafeAreaView>
  );
}
