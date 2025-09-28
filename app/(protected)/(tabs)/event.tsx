import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Title from '@/components/ui/title';
import { PlusCircle, Search } from 'lucide-react-native';
import { View } from 'react-native';

export default function Event() {
  return (
    <View className="flex-1">
      <View className="flex-1 max-w-md mx-auto w-full flex-col gap-4 py-5">
        <View>
          <Input
            className=" border-primary/60 rounded-md py-1"
            placeholder="Search..."
            leftIcon={<Search color="#8E1616" />}
          />
        </View>
        <View className="flex-row items-center gap-4">
          <Button className="flex-1 bg-secondary rounded-sm">
            <Title className="text-xl text-white">CREATE EVENT</Title>
            <PlusCircle color="white" />
          </Button>
        </View>
      </View>
    </View>
  );
}
